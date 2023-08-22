import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "../types";
import { ApiError, catchAsync } from "../utils";
import { AppDataSource } from "../config";
import { User } from "../database/entities";

const checkWallet = catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const userId = req.user.id; // Assuming you're using authentication middleware to attach user information to the request
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({
            id: userId,
        });

        if (!user || !user.wallet) {
            return new ApiError(
                httpStatus.NOT_FOUND,
                "User does not have a wallet"
            );
        }

        next();
    }
);

export default checkWallet;
