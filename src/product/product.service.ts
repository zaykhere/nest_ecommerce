import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { Category } from './entities/category.entity';
import { CreateProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,

        @InjectRepository(ProductVariant)
        private productVariantRepository: Repository<ProductVariant>,

        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,

        private dataSource: DataSource

    ) {}

    async createProduct(payload: CreateProductDto) {
        const {name, price, description, categoryId} = payload;

        const productVariants = payload.productVariants;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const category = await this.categoryRepository.findOne({
                where: {
                    id: categoryId
                }
            })
            if (!category) {
                return {
                    success: false,
                    message: `Category with ID ${payload.categoryId} not found`,
                }
            }

            const product = await queryRunner.manager.save(Product, {name, price, description, category});

            let productVariantData = productVariants.map((item) => {
                return {
                    ...item,
                    product
                }
            })

            await queryRunner.manager.save(ProductVariant, productVariantData);

            await queryRunner.commitTransaction();

            return {
                success: true,
                message: "Product created successfully"
            }

        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            return {
                success: false,
                message: error.message
            }
        }
        finally {
            await queryRunner.release();
        }
    }
}
