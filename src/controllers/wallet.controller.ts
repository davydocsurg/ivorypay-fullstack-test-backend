import { Response } from "express";
import httpStatus from "http-status";
import { walletService } from "../services";
import { AuthRequest } from "../types";
import { catchAsync } from "../utils";

const createWallet = catchAsync(async (req: AuthRequest, res: Response) => {
    const wallet = await walletService.createWallet(req.user);
    res.status(httpStatus.CREATED).send({ wallet });
});

export default {
    createWallet,
};
