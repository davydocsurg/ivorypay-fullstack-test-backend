import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "../types";
import { ApiError, catchAsync } from "../utils";
import { AppDataSource, logger } from "../config";
import { User, Wallet } from "../database/entities";

const walletRepository = AppDataSource.getRepository(Wallet);
const userRepository = AppDataSource.getRepository(User);
const checkWallet = catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const userId = req.user.id;
        const wallet = await findUserWallet(userId);

        if (req.body.recipientEmail) {
            const recipient = await userRepository.findOneBy({
                email: req.body.recipientEmail,
            });

            if (!recipient) {
                return next(
                    new ApiError(
                        httpStatus.NOT_FOUND,
                        "Recipient does not exist"
                    )
                );
            }
            const recipientWallet = await findUserWallet(recipient!.id);
            if (!recipientWallet) {
                return next(
                    new ApiError(
                        httpStatus.NOT_FOUND,
                        "Recipient does not have a wallet"
                    )
                );
            }
        }

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

const findUserWallet = async (userId: string) => {
    return await walletRepository.findOneBy({
        user: { id: userId },
    });
};

export default checkWallet;
