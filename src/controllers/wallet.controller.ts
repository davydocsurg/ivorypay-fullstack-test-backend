import { Response } from "express";
import httpStatus from "http-status";
import { userService, walletService } from "../services";
import { AuthRequest } from "../types";
import { ApiError, catchAsync } from "../utils";
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

    await walletService.depositFunds(user, amount);
    const wallet = await walletService.getWalletByUserId(req.user.id);

    res.send({ wallet, message: "Funds deposited successfully" });
});

const transferFunds = catchAsync(async (req: AuthRequest, res: Response) => {
    const { amount, recipientEmail } = req.body;
    const sender = req.user;
    const senderWallet = sender.wallet;

    // Check if user exists
    const authUser = await userService.getUserByEmail(sender.email);
    if (!authUser) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if recipient exists
    const recipient = await userService.getUserByEmail(recipientEmail);
    if (!recipient) {
        throw new ApiError(httpStatus.NOT_FOUND, "Recipient does not exist");
    }

    // Get recipient's wallet address using recipient's id
    const recipientWallet = await walletService.getWalletByUserId(recipient.id);
    if (!recipientWallet) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "Recipient does not have a wallet"
        );
    }

    // Check if recipient is the same as sender
    if (sender.email === recipientEmail) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "You cannot transfer funds to yourself. Deposit funds instead."
        );
    }

    await walletService.transferFunds(
        authUser,
        recipientWallet,
        amount,
        recipient.email
    );

    const wallet = await walletService.getWalletByUserId(sender.id);

    res.send({
        wallet,
        message:
            "Funds transferred successfully. Check your email for more details.",
    });
});

const withdrawFunds = catchAsync(async (req: AuthRequest, res: Response) => {
    const { amount } = req.body;
    const user = req.user;

    await walletService.withdrawFunds(user, amount);
    const wallet = await walletService.getWalletByUserId(user.id);
    res.send({ wallet, message: "Funds withdrawn successfully" });
});

export default {
    createWallet,
    depositFunds,
    transferFunds,
    withdrawFunds,
};
