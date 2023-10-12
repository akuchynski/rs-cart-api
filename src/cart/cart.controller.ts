import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { CartService } from './services';

@Controller('profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  @Get()
  @UseGuards(BasicAuthGuard)
  async findUserCart(@Req() req: AppRequest) {
    const { items } = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );
    return items;
  }

  @Put()
  @UseGuards(BasicAuthGuard)
  async updateUserCart(@Req() req: AppRequest, @Body() body) {
    return await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      body,
    );
  }

  @Delete()
  @UseGuards(BasicAuthGuard)
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @Post('checkout')
  @UseGuards(BasicAuthGuard)
  async submitOrder(@Req() req: AppRequest, @Body() body) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode;
      return {
        statusCode,
        message: 'Cart is empty',
      };
    }

    const order = await this.orderService.create({
      user_id: userId,
      cart_id: cart.id,
      payment: { pay: '0' },
      delivery: { ...body.address },
      comments: body.address.comment,
      total: body.total,
    });
    await this.cartService.removeByUserId(userId);
    return order;
  }
}
