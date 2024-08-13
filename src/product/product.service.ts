import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, In, Repository } from 'typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { Category } from './entities/category.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { GetProductsDto } from './dto/getProducts.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    private dataSource: DataSource,
  ) {}

  async createProduct(payload: CreateProductDto) {
    const { name, price, description, categoryId } = payload;

    const productVariants = payload.productVariants;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = await this.categoryRepository.findOne({
        where: {
          id: categoryId,
        },
      });
      if (!category) {
        return {
          success: false,
          message: `Category with ID ${payload.categoryId} not found`,
        };
      }

      const product = await queryRunner.manager.save(Product, {
        name,
        price,
        description,
        category,
      });

      let productVariantData = productVariants.map((item) => {
        return {
          ...item,
          product,
        };
      });

      await queryRunner.manager.save(ProductVariant, productVariantData);

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Product created successfully',
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return {
        success: false,
        message: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async getProductsPaginated(query: GetProductsDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const offset = (page - 1) * limit;

    const queryBuilder = this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.productVariants', 'productVariants')
      .skip(offset)
      .take(limit)
      .orderBy(`products.${sortBy}`, sortOrder);

    if (search) {
      queryBuilder.andWhere(
        'products.name ILIKE :search OR products.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    const [products, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const nextPage = page < totalPages ? page + 1 : null;

    return {
      data: products,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
        nextPage,
      },
    };
  }

  async getProductById(id: number): Promise<Product | null> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: ['category', 'productVariants'],
    });

    return product;
  }

  async updateProduct(id: number, data: UpdateProductDto) {
    const { name, price, description, categoryId } = data;

    const productVariants = data.productVariants;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = await this.categoryRepository.findOne({
        where: {
          id: categoryId,
        },
      });
      if (!category) {
        return {
          error: 'Not Found',
          message: `Category with ID ${data.categoryId} not found`,
        };
      }

      await this.productRepository.update(
        { id },
        { name, price, description, category },
      );

      const values = productVariants
        .map(
          (variant, index) =>
            `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`,
        )
        .join(', ');

      const query = `
        INSERT INTO product_variants (id, size, price, stock)
        VALUES ${values}
        ON CONFLICT (id) DO UPDATE SET
        size = EXCLUDED.size,
        price = EXCLUDED.price,
        stock = EXCLUDED.stock;
      `;

      const parameters = productVariants.reduce((acc, variant) => {
        acc.push(variant.id, variant.size, variant.price, variant.stock);
        return acc;
      }, []);

      await this.productVariantRepository.query(query, parameters);

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Product has been updated successfully'
      }
    } catch (error) {
        console.log(error);
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          message: error.message,
          error: error.message
        };
      } finally {
        await queryRunner.release();
      }
  }
}
