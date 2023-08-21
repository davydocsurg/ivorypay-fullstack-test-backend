import { Request, Response } from "express";
import httpStatus from "http-status";
import { authService, userService } from "../services";
import {
    ApiError,
    catchAsync,
    encryptPassword,
    exclude,
    generateReferralCode,
} from "../utils";

const register = catchAsync(async (req: Request, res: Response) => {
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
    // await userService.createInvitation({
    //     email: user.email,
    //     referralCode: user.referralCode,
    const userWithoutPassword = exclude(user, [
        "password",
        "createdAt",
        "updatedAt",
    ]);
    res.status(httpStatus.CREATED).send(userWithoutPassword);
});

const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await authService.loginWithEmailAndPassword(email, password);
    const token = authService.createSendToken(user, res);
    res.send({ user, token });
});

export default { register, login };
