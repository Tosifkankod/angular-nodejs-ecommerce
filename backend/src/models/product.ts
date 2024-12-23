import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("products") 
export class Product {
  @PrimaryGeneratedColumn() 
  id!: number;

  @Column({ unique: true })
  sku!: string;

  @Column() 
  name!: string;

  @Column("decimal", { precision: 10, scale: 2 }) 
  price!: number;

  @Column() 
  thumbnail!: string;

  @Column("text", { array: true })
  images!: string[];
}
