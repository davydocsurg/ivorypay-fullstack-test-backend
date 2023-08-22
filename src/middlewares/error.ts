import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { config, logger } from "../config";
import { ApiError } from "../utils";

export const errorConverter: ErrorRequestHandler = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode
            ? httpStatus.BAD_REQUEST
            : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export const gErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (config.env === "production" && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(config.env === "development" && { stack: err.stack }),
    };

    if (config.env === "development") {
        logger.error(err);
    }

    res.status(statusCode).send(response);
};
