import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getGlobalStats();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('stats/chart')
  getChartData() {
    return this.adminService.getTransactionStatusChart();
  }
}
