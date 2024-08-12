import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

enum SortBy {
  PRICE = 'price',
  NAME = 'name',
  DATE = 'date',
}

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetProductsDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page: number = 1;

  @IsInt()
  @Min(1)
  @Max(50)
  @Transform(({ value }) => parseInt(value, 10))
  limit: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsEnum(SortBy)
  sortBy: SortBy = SortBy.PRICE; // Default sort by price

  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.ASC; // Default sort order
}
