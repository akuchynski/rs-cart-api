import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { OrderController } from './order.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
