import { DataSource } from "typeorm";
import { Product } from "../models/product";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : undefined,
  username: process.env.POSTGRES_USER, 
  password: process.env.POSTGRES_PASSWORD,
  database: "products",  
  synchronize: true,
  ssl: {
    rejectUnauthorized: false, // Use true in production and provide CA certificates
  },
  entities: [Product],
  migrations: [`${__dirname}/**/migrations/*.{ts,js}`], 
});
