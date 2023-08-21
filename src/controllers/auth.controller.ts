import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "../services";
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

    // verify invitation code
    const validReferralCode = await userService.verifyReferralCode(
        referralCode as string
    );
    if (!validReferralCode) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid invitation code");
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

export default { register };
