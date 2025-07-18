import { Controller, Post, Body, ValidationPipe, Get, UseGuards, Request, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.username);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
