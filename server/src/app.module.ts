import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthModule,
    PaymentsModule,
    UsersModule,
    AdminModule, 
  ],
})
export class AppModule {}
