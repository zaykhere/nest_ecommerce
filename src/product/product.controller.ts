import { Body, Controller, HttpException, InternalServerErrorException, Post, Query, UseGuards, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { AdminGuard } from 'src/admin/admin.guard';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post('create')
    async createProduct(@Body() createProductDto: CreateProductDto) {
        const created = await this.productService.createProduct(createProductDto);

        if(created.success === false) {
            throw new InternalServerErrorException(created.message);
        }

        return created;
    }

    @Get()
    async getProductsPaginated(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {}
}
