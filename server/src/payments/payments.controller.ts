
import { Controller, Get, Post, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    const userId = req.user.userId;
    return this.paymentsService.create(createPaymentDto, userId);
  }

  @Get()
 
  findAll(@Query() query: { status?: string; method?: string; startDate?: string, endDate?: string, page?: string, limit?: string }, @Request() req) {
    const userId = req.user.userId;
    
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '8', 8);
    
    return this.paymentsService.findAll({
      status: query.status,
      method: query.method, 
      startDate: query.startDate,
      endDate: query.endDate,
      page,
      limit,
    }, userId);
  }
  
  @Get('stats')
  getStats(@Request() req) {
    const userId = req.user.userId;
    return this.paymentsService.getStats(userId);
  }

  @Get('stats/chart')
  getChartData(@Request() req) {
    const userId = req.user.userId;
    return this.paymentsService.getChartData(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.paymentsService.findOne(id, userId);
  }
}