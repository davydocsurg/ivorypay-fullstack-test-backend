import { NextFunction } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "../types";
import { ApiError, catchAsync } from "../utils";
import { logger } from "../config";

const isAdmin = catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        logger.info(req.user);
        if (req.user && req.user.role === "admin") {
            next();
        } else {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
        }
    }
);

export default isAdmin;
