import { IsString, IsNumber, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  receiver: string;

  @IsIn(['success', 'failed', 'pending'])
  status: string;

  @IsString()
  method: string;
}