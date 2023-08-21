import dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";

dotenv.config();
const databasePortEnv = process.env.DATABASE_PORT;

if (!databasePortEnv) {
    throw new Error("DATABASE_PORT environment variable is not defined.");
}

const databasePort = parseInt(databasePortEnv, 10);

const configuration = {
    database: {
        type: process.env.DATABASE_TYPE as any,
        host: process.env.DATABASE_HOST,
        port: databasePort,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [__dirname + "src/database/entities/*{.ts,.js}"],
        migrations: ["src/database/migrations/*{.ts,.js}"],
        subscribers: ["src/database/subscribers/**/*{.ts,.js}"],
    },
    jwtSecret: process.env.JWT_SECRET,
};

export const AppDataSource = new DataSource({
    type: configuration.database.type,
    host: configuration.database.host,
    port: configuration.database.port,
    username: configuration.database.username,
    password: configuration.database.password,
    database: configuration.database.database,
    synchronize: false,
    logging: false,
    entities: configuration.database.entities,
    migrations: configuration.database.migrations,
    subscribers: configuration.database.subscribers,
});
