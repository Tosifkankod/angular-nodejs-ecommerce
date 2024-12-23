"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const product_1 = require("../models/product");
exports.AppDataSource = new typeorm_1.DataSource({
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
    entities: [product_1.Product],
    migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
});
