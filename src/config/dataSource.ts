import dotenv from "dotenv";
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
        entities: ["src/entities/**/*.ts"],
        migrations: ["src/migrations/**/*.ts"],
        subscribers: ["src/subscribers/**/*.ts"],
        cli: {
            entitiesDir: "src/entities",
            migrationsDir: "src/migrations",
            subscribersDir: "src/subscribers",
        },
    },
    jwtSecret: process.env.JWT_SECRET,
};

const AppDataSource = new DataSource({
    type: configuration.database.type,
    host: configuration.database.host,
    port: configuration.database.port,
    username: configuration.database.username,
    password: configuration.database.password,
    database: configuration.database.database,
    synchronize: true,
    logging: true,
    entities: configuration.database.entities,
    migrations: configuration.database.migrations,
    subscribers: configuration.database.subscribers,
});

export default AppDataSource;
