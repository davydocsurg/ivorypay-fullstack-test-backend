import express from "express";
import cors from "cors";
import { config, errorHandler, successHandler } from "./config";
import { errorConverter, gErrorHandler } from "./middlewares";

const app = express();

if (config.env !== "test") {
    app.use(successHandler);
    app.use(errorHandler);
}

// enable cors
app.use(cors());
app.options("*", cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(gErrorHandler);

export default app;
