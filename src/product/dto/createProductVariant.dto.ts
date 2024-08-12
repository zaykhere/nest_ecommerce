import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { Size } from '../entities/product-variant.entity';

export class CreateProductVariantDto {
  @IsEnum(Size)
  size: Size;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  stock: number;
}
