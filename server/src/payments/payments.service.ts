import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, userId: string): Promise<Payment> {
    const createdPayment = new this.paymentModel({
      ...createPaymentDto,
      userId,
      date: new Date(),
    });
    return createdPayment.save();
  }

  async findAll(query: { status?: string; method?: string; startDate?: string, endDate?: string, page?: number, limit?: number }, userId: string) {
    const { status, method, startDate, endDate, page = 1, limit = 10 } = query;
    
    const filters: any = { userId };
    if (status && status !== 'all') {
      filters.status = status;
    }
    
    if (method) {
      filters.method = { $regex: new RegExp(method, 'i') };
    }

    if (startDate && endDate) {
      filters.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const totalCount = await this.paymentModel.countDocuments(filters);
    const data = await this.paymentModel
      .find(filters)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      data,
      totalCount,
      currentPage: page,
      hasNextPage: page * limit < totalCount,
    };
  }

  async findOne(id: string, userId: string): Promise<Payment> {
    const payment = await this.paymentModel.findOne({ _id: id, userId }).exec();
    
    if (!payment) {
      throw new NotFoundException(`Payment with ID "${id}" not found`);
    }

    return payment;
  }

  async getStats(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - today.getDay());

    const totalRevenueResult = await this.paymentModel.aggregate([
      { $match: { status: 'success', userId: userObjectId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalPaymentsToday = await this.paymentModel.countDocuments({
      userId,
      date: { $gte: today },
    });
    
    const totalPaymentsThisWeek = await this.paymentModel.countDocuments({
      userId,
      date: { $gte: startOfWeek },
    });

    const failedTransactions = await this.paymentModel.countDocuments({
      userId,
      status: 'failed',
    });

    return {
      totalRevenue: totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0,
      totalPaymentsToday,
      totalPaymentsThisWeek,
      failedTransactions,
    };
  }

  async getChartData(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const results = await this.paymentModel.aggregate([
      {
        $match: {
          userId: userObjectId,
          status: 'success',
          date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalRevenue: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const revenueMap = new Map(
      results.map((item) => [item._id, item.totalRevenue]),
    );

    const labels: string[] = [];
    const data: number[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      data.push(revenueMap.get(dateString) || 0);
    }

    return { labels, datasets: [{ data }] };
  }

  async getGlobalPaymentStats() {
    const totalRevenueResult = await this.paymentModel.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalTransactions = await this.paymentModel.countDocuments();
    return {
      totalRevenue: totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0,
      totalTransactions,
    };
  }

  async countTransactionsByStatus() {
    return this.paymentModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}