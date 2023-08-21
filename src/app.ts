import express from "express";
import httpStatus from "http-status";
import cors from "cors";
import { config, errorHandler, successHandler } from "./config";
import { errorConverter, gErrorHandler } from "./middlewares";
import routes from "./routes";
import { ApiError } from "./utils";

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

// v1 api routes
app.use("/api/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(gErrorHandler);

export default app;
