import { IsArray, ValidateNested } from 'class-validator';
import { CreateProductDto } from './createProduct.dto';
import { Type } from 'class-transformer';
import { UpdateProductVariantDto } from './updateProductVariant.dto';

export class UpdateProductDto extends CreateProductDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateProductVariantDto)
  @IsArray()
  productVariants: UpdateProductVariantDto[];
}
