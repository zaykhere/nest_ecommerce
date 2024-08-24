import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/productVariant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, ProductVariant])],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
