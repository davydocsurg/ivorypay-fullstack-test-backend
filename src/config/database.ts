import dotenv from "dotenv";

dotenv.config();
const databasePortEnv = process.env.DATABASE_PORT;

if (!databasePortEnv) {
    throw new Error("DATABASE_PORT environment variable is not defined.");
}

const databasePort = parseInt(databasePortEnv, 10);

const configuration = {
    database: {
        host: process.env.DATABASE_HOST,
        port: databasePort,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
    jwtSecret: process.env.JWT_SECRET,
};

export default configuration;
