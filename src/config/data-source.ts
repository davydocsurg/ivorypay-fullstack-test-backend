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
import config from "./config";

export const AppDataSource = new DataSource({
    type: type as any,
    host: host,
    port: port,
    username: username,
    password: password,
    database: config.env === config.TEST ? "ivorypay-test" : database,
    synchronize: synchronize,
    logging: logging,
    entities: entities,
    migrations: migrations,
    subscribers: subscribers,
});
