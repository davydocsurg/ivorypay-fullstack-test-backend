import "reflect-metadata";
import { DataSource } from "typeorm";
import {
    database,
    entities,
    host,
    logging,
    migrations,
    password,
    port,
    subscribers,
    synchronize,
    type,
    username,
} from "../../ormconfig.json";

export const AppDataSource = new DataSource({
    type: type as any,
    host: host,
    port: port,
    username: username,
    password: password,
    database: database,
    synchronize: synchronize,
    logging: logging,
    entities: entities,
    migrations: migrations,
    subscribers: subscribers,
});
