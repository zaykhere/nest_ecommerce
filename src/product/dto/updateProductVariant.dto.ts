import { IsNumber, IsPositive } from "class-validator";
import { CreateProductVariantDto } from "./createProductVariant.dto";

export class UpdateProductVariantDto extends CreateProductVariantDto {
    @IsNumber()
    @IsPositive()

    id: number;
}