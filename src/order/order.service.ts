import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateOrderDto } from './dto/createOrder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/OrderItem.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Order } from './entities/Order.entity';
import { ProductVariant } from '../product/entities/productVariant.entity';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common/exceptions';
@Injectable()
export class OrderService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    private dataSource: DataSource,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET'),
      {
        apiVersion: '2024-06-20',
      },
    );
  }

  async createCheckoutSession(data: CreateOrderDto) {
    const orderItemsPayload = data.items;
    const {shippingAddressLine1, shippingAddressLine2, city, country, state, postalCode} = data;

    const productVariantData = await this.productVariantRepository.find({
      where: {
        id: In(orderItemsPayload.map((item) => item.productVariantId))
      }
    });

    if(productVariantData.length <= 0) {
      throw new BadRequestException("No product variants found for the given items.");
    }

    const orderItemsData = orderItemsPayload.map((item) => {
      const productVariant = productVariantData.find((elem) => elem.id === item.productVariantId);
      return {
        productVariant,
        quantity: item.quantity,
        price: item.quantity * productVariant.price
      }
    })
    
    const totalAmount = orderItemsData.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);

    const orderData = {
      items: orderItemsData,
      shippingAddressLine1,
      shippingAddressLine2,
      city,
      country,
      state,
      postalCode,
      totalAmount
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const order = await queryRunner.manager.save(Order, orderData);

      const orderItemsToInsert = orderItemsData.map(item => {
        return {
          ...item,
          order
        }
      });

      const orderItems = await queryRunner.manager.save(OrderItem, orderItemsToInsert);

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: orderItems.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.productVariant.name,
            },
            unit_amount: item.price * 100, // price in cents
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: data.successUrl,
        cancel_url: data.cancelUrl,
        metadata: {
          orderId: order.id, // Store the order ID in the metadata
        },
      });
      await queryRunner.commitTransaction();
      return session;

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Something went wrong");
    }
  }
}
