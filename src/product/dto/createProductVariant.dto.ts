import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { Size } from '../entities/productVariant.entity';

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
