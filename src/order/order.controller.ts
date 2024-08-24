import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { Post, Body, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() body: CreateOrderDto) {
    
    const session = await this.orderService.createCheckoutSession(body);

    if(session && session.id) {
      return session.id;
    }

    throw new InternalServerErrorException("Something went wrong");
  
  }
}
