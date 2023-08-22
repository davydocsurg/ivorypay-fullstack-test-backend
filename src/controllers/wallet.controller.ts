import { Response } from "express";
import httpStatus from "http-status";
import { userService, walletService } from "../services";
import { AuthRequest } from "../types";
import { ApiError, catchAsync } from "../utils";
import { EntityManager } from "typeorm";
import { AppDataSource, logger } from "../config";
import { User } from "../database/entities";

const userRepo = AppDataSource.getRepository(User);

const createWallet = catchAsync(async (req: AuthRequest, res: Response) => {
    logger.info("Creating wallet for user: " + req.user.wallet);
    // return;
    const wallet = await walletService.createWallet(req.user);
    res.status(httpStatus.CREATED).send({ wallet });
});

const depositFunds = catchAsync(async (req: AuthRequest, res: Response) => {
    const { amount } = req.body;

    // Check if user exists
    const user = await userService.getUserByEmail(req.user.email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const wallet = await walletService.depositFunds(user, amount);

    res.send({ wallet });
});

const transferFunds = catchAsync(async (req: AuthRequest, res: Response) => {
    const { amount, recipientEmail } = req.body;
    const sender = req.user;
    const senderWallet = sender.wallet;

    // Check if user exists
    const user = await userService.getUserByEmail(sender.email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if recipient exists
    const recipient = await userService.getUserByEmail(recipientEmail);
    if (!recipient) {
        throw new ApiError(httpStatus.NOT_FOUND, "Recipient does not exist");
    }

    logger.warn("Re: " + recipient.wallet);

    // Check if recipient is the same as sender
    if (sender.email === recipientEmail) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "You cannot transfer funds to yourself. Deposit funds instead."
        );
    }

    const wallet = await walletService.transferFunds(
        user,
        recipient.wallet.address,
        amount
    );

    res.send({ wallet });
});

export default {
    createWallet,
    depositFunds,
    transferFunds,
};
