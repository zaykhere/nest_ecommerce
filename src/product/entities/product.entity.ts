import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { ProductVariant } from './productVariant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Category, category => category.products, {nullable: false})
  category: Category;

  @OneToMany(() => ProductVariant, productVariant => productVariant.product)
  productVariants: ProductVariant[];
}
