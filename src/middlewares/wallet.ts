import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "../types";
import { ApiError, catchAsync } from "../utils";
import { AppDataSource } from "../config";
import { Wallet } from "../database/entities";

const walletRepository = AppDataSource.getRepository(Wallet);
const checkWallet = catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const userId = req.user.id;
        const wallet = await walletRepository.findOneBy({
            user: { id: userId },
        });

        if (!wallet && !wallet!.address) {
            return next(
                new ApiError(
                    httpStatus.NOT_FOUND,
                    "User does not have a wallet"
                )
            );
        }

        return next();
    }
);

export default checkWallet;
