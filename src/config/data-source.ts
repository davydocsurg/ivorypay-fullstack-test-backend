import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

const entities = ["src/database/entities/*{.ts,.js}"];
const migrations = ["src/database/entities/*{.ts,.js}"];
const subscribers = ["src/database/entities/*{.ts,.js}"];

export const AppDataSource = new DataSource({
    type: process.env.DATABASE_TYPE as any,
    host: process.env.APP_HOST,
    port: process.env.DATABASE_PORT as any,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: false,
    entities: entities,
    migrations: migrations,
    subscribers: subscribers,
});
