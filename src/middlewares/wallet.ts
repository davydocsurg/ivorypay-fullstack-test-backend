import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "../types";
import { ApiError, catchAsync } from "../utils";
import { AppDataSource, logger } from "../config";
import { Wallet } from "../database/entities";

const walletRepository = AppDataSource.getRepository(Wallet);
const checkWallet = catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const userId = req.user.id; // Assuming you're using authentication middleware to attach user information to the request
        const wallet = await walletRepository.findOneBy({
            user: { id: userId },
        });

        if (wallet) {
            return next();
        } else {
            throw new ApiError(
                httpStatus.NOT_FOUND,
                "User does not have a wallet"
            );
        }
    }
);

export default checkWallet;
