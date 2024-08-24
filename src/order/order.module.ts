import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/Order.entity';
import { OrderItem } from './entities/OrderItem.entity';
import { ProductVariant } from '../product/entities/productVariant.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [TypeOrmModule.forFeature([Order, OrderItem, ProductVariant, Product])],
})
export class OrderModule {}
