import httpStatus from "http-status";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError, catchAsync } from "../utils";
import { AppDataSource, config, logger } from "../config";
import { User } from "../database/entities";
import { AuthRequest } from "../types";

const userRepo = AppDataSource.getRepository(User);

const jwt_key: string = config.jwt.secret;
const isAuthenticated = catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        let token: string | undefined;
        // check if token is set
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(
                new ApiError(
                    httpStatus.UNAUTHORIZED,
                    "Unauthorized. Please login to continue."
                )
            );
        }

        let payload: any;
        // verify token
        try {
            payload = jwt.verify(token, jwt_key);
            // Logging.info(payload);
        } catch (error) {
            logger.error(error);
            return next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid token"));
        }
        // Logging.warn(`${payload} payload`);
        // check if user still exists in the database
        const currentUser = await userRepo.findOneBy({
            id: payload.id,
        });
        if (!currentUser) {
            return next(
                new ApiError(
                    httpStatus.UNAUTHORIZED,
                    "This User does not exist"
                )
            );
        }

        // check if user's password is still thesame since token issue
        const passwordChanged = await passwordWasChanged(
            currentUser,
            payload.iat
        );
        // Logging.error(passwordChanged);
        if (passwordChanged) {
            return next(
                new ApiError(
                    httpStatus.UNAUTHORIZED,
                    "User recently changed password. Please, login again"
                )
            );
        }

        // grant access
        req.user = currentUser;
        return next();
    }
);

const passwordWasChanged = async (
    user: User,
    loginTimestamp: Date
): Promise<boolean> => {
    const thresholdInHours = 24;
    const thresholdTimestamp = new Date(loginTimestamp);
    thresholdTimestamp.setHours(
        thresholdTimestamp.getHours() - thresholdInHours
    );

    if (user.passwordChangedAt && user.passwordChangedAt > thresholdTimestamp) {
        return true; // User recently changed password
    }

    return false; // User did not recently change password
};

export default isAuthenticated;
