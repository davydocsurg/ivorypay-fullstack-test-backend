import { Response } from "express";
import httpStatus from "http-status";
import { authService, userService, walletService } from "../services";
import {
    ApiError,
    catchAsync,
    encryptPassword,
    exclude,
    generateReferralCode,
} from "../utils";
import { AuthRequest } from "../types";
import { config, logger } from "../config";
import { RoleEnumType, User } from "../database/entities";

const register = catchAsync(async (req: AuthRequest, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    const { referralCode, role } = req.query;

    // Validate referral code and get referrer
    const referrer = await validateAndRetrieveReferrer(referralCode as string);

    // Create user
    const user = await createUserWithEmailAndPassword(
        email,
        password,
        firstName,
        lastName,
        referrer,
        role as RoleEnumType
    );

    // Create invitation and update referrer's referredUsers
    // await createInvitationAndUpdateReferrer(referrer, user);

    // Create wallet
    await walletService.createWallet(user);

    // Prepare response
    const userWithoutPassword = exclude(user, [
        "password",
        "createdAt",
        "updatedAt",
    ]);

    res.status(httpStatus.CREATED).send(userWithoutPassword);
});

async function validateAndRetrieveReferrer(
    referralCode: string
): Promise<User> {
    if (config.env === config.TEST) {
        const testReferralCode = config.testReferralCode;
        const referrer = await userService.getUserByReferralCode(
            testReferralCode
        );
        if (!referrer) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                "Invalid test referral code"
            );
        }
        return referrer;
    }

    if (!referralCode) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Referral code is required");
    }

    const referrer = await userService.getUserByReferralCode(referralCode);
    if (!referrer) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid referral code");
    }

    return referrer;
}

async function createUserWithEmailAndPassword(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    referredBy: User,
    role?: RoleEnumType
): Promise<User> {
    const encryptedPassword = await encryptPassword(password);

    return userService.createUser({
        email,
        password: encryptedPassword,
        firstName,
        lastName,
        referralCode: generateReferralCode(),
        referredBy,
        role,
    });
}

async function createInvitationAndUpdateReferrer(referrer: User, user: User) {
    const invitation = await userService.createInvitation({
        email: user.email,
        inviter: referrer,
        invitee: user,
        accepted: true,
    });

    const updatedValues = {
        referredUsers: [user], // Update referredUsers array with the new user
    };
    await userService.updateUser(referrer.id, updatedValues);
}

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
