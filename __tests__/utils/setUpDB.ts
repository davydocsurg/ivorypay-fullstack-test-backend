import { beforeAll, afterAll } from "@jest/globals";
import { TestDataSource, logger } from "../../src/config";

const setUpDB = () => {
    beforeAll(async () => {
        await TestDataSource.initialize();
        logger.info("Database initialized.");
    });

    afterAll(async () => {
        await TestDataSource.destroy(); // Close database connections
        logger.info("Database connections closed.");
    });
};

export default setUpDB;
