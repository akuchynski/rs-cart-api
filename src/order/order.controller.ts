import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { AppRequest } from '../shared';
import { OrderService } from './services';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async getOrders() {
    return await this.orderService.getOrders();
  }

  @Get(':id')
  async getOrderById(@Req() req: AppRequest) {
    return await this.orderService.findById(req.params.id);
  }

  @Put(':id/status')
  async updateOrderStatus(@Req() req: AppRequest, @Body() body) {
    const { comment, status } = body;
    await this.orderService.updateStatusAndCommentById(req.params.id, {
      comment,
      status,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @Delete(':id')
  async deleteOrder(@Req() req: AppRequest) {
    await this.orderService.deleteOrder(req.params.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }
}
