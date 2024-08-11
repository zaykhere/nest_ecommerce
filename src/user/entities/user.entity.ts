import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: true })
  isAdmin: boolean;

  constructor(userData: Partial<User>) {
    Object.assign(this, userData);
  }
}