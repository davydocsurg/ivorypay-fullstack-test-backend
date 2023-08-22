import { NextFunction } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "../types";
import { ApiError, catchAsync } from "../utils";

const isAdmin = catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (req.user && req.user.role === "admin") {
            next();
        } else {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
        }
    }
);

export default isAdmin;
