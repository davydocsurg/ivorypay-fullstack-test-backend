import app from "./app";
import { Server } from "http";
import { AppDataSource, config, logger } from "./config";
import { promises as fsPromises } from "fs";

let server: Server;
AppDataSource.initialize().then(() => {
    logger.info("Database initialized.");
    server = app.listen(config.port, () => {
        console.log(`Listening to port ${config.port}`);
    });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info("Server closed.");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: Error) => {
    logger.error(error);
    exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
    logger.info("SIGTERM received.");
    if (server) {
        server.close();
    }
});

export default server!;
