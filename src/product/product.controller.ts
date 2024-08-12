import { Body, Controller, HttpException, InternalServerErrorException, Post, Query, UseGuards, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { AdminGuard } from 'src/admin/admin.guard';
import { GetProductsDto } from './dto/getProducts.dto';

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
        @Query() query: GetProductsDto
    ) {
        const products = await this.productService.getProductsPaginated(query);

        return products;
    }

    @Get(':id')
    async getProductById(
        @Param('id', ParseIntPipe) id: number,
    ) {
        const product = await this.productService.getProductById(id);

        if(!product) {
            throw new NotFoundException("Product not found");
        }

        return product;
    }
}
