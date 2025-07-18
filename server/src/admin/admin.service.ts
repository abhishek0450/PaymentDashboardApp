import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private paymentsService: PaymentsService,
  ) {}

  async getGlobalStats() {
    const totalUsers = await this.usersService.countAll();
    const { totalRevenue, totalTransactions } = await this.paymentsService.getGlobalPaymentStats();
    
    return {
      totalUsers,
      totalRevenue,
      totalTransactions,
    };
  }

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async getTransactionStatusChart() {
    const statusCounts = await this.paymentsService.countTransactionsByStatus();
    
    const labels = ['Success', 'Pending', 'Failed'];
    const dataMap = new Map(statusCounts.map(item => [item._id, item.count]));

    const data = labels.map(label => dataMap.get(label.toLowerCase()) || 0);

    return {
      labels,
      datasets: [{ data }],
    };
  }
}