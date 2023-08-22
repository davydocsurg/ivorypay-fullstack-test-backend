import { Response } from "express";
import httpStatus from "http-status";
import { userService, walletService } from "../services";
import { AuthRequest } from "../types";
import { ApiError, catchAsync } from "../utils";
import { EntityManager } from "typeorm";
import { AppDataSource } from "../config";
import { User } from "../database/entities";

const userRepo = AppDataSource.getRepository(User);

const createWallet = catchAsync(async (req: AuthRequest, res: Response) => {
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

export default {
    createWallet,
    depositFunds,
};
