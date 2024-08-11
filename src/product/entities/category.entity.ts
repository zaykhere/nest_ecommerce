import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  // Self-referencing many-to-one relationship
  @ManyToOne(() => Category, category => category.subcategories, { nullable: true })
  parent: Category;

  // Self-referencing one-to-many relationship
  @OneToMany(() => Category, category => category.parent)
  subcategories: Category[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
