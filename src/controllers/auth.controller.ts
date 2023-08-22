import { Response } from "express";
import httpStatus from "http-status";
import { authService, userService } from "../services";
import {
    ApiError,
    catchAsync,
    encryptPassword,
    exclude,
    generateReferralCode,
} from "../utils";
import { AuthRequest } from "../types";
import { logger } from "../config";

const register = catchAsync(async (req: AuthRequest, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    const { referralCode } = req.query;

    if (!referralCode) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Referral code is required");
    }

    // verify invitation code
    const validReferralCode = await userService.verifyReferralCode(
        referralCode as string
    );
    if (!validReferralCode) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid referral code");
    }

    const user = await userService.createUser({
        email,
        password: await encryptPassword(password),
        firstName,
        lastName,
        referralCode: generateReferralCode(),
    });
    await userService.createInvitation({
        email: user.email,
        inviter: req.user,
    });

    const userWithoutPassword = exclude(user, [
        "password",
        "createdAt",
        "updatedAt",
    ]);
    res.status(httpStatus.CREATED).send(userWithoutPassword);
});

const login = catchAsync(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;
    const user = await authService.loginWithEmailAndPassword(email, password);
    const token = authService.createSendToken(user, res);
    req.user = user;
    const userWithoutPassword = exclude(user, ["password"]);
    res.send({ user: userWithoutPassword, token });
});

const testA = catchAsync(async (req: AuthRequest, res: Response) => {
    logger.info("testA");
});

export default { register, login, testA };
