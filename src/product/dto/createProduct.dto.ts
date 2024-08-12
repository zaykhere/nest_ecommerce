import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { CreateProductVariantDto } from './createProductVariant.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsNumber({allowNaN: false, allowInfinity: false})
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  @IsArray()
  productVariants: CreateProductVariantDto[];
}