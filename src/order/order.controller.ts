import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { Post, Body, InternalServerErrorException, Req, Res } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import {Request, Response} from "express";

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

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];
    const payload = req.rawBody; // Make sure rawBody is available (e.g., by using express.raw())

    await this.orderService.processWebhook(payload, sig);

    res.status(200).json({ received: true });
  }
}
