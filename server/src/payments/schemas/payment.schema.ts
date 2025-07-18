import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose'; 
import { User } from '../../users/schemas/user.schema'; 

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true, enum: ['success', 'failed', 'pending'] })
  status: string;

  @Prop({ required: true })
  method: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);