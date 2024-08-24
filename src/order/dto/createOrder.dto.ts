import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MinLength, ValidateNested } from 'class-validator';

class OrderItemDto {
  @IsNumber()
  @IsPositive()
  productVariantId: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @MinLength(3)
  shippingAddressLine1: string;

  @IsOptional()
  shippingAddressLine2: string;

  @IsNotEmpty()
  @MinLength(3)
  city: string;

  @IsNotEmpty()
  @MinLength(3)
  country: string;

  @IsNotEmpty()
  @MinLength(2)
  state: string;

  @IsNotEmpty()
  @MinLength(5)
  postalCode: string;

  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsArray()
  items: OrderItemDto[];

  @IsString()
  successUrl: string;

  @IsString()
  cancelUrl: string;
}