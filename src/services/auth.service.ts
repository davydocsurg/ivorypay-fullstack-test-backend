import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { AppDataSource, config } from "../config";
import { User } from "../database/entities";
import { ApiError, exclude, isPasswordMatch } from "../utils";
import userService from "./user.service";
import { Response } from "express";

const userRepo = AppDataSource.getRepository(User);

/**
 * Login a user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Omit<User, 'password'>>}
 */
const loginWithEmailAndPassword = async (
    email: string,
    password: string
    // omit password, createdAt, updatedAt
): Promise<
    Omit<
        User,
        | "password"
        | "save"
        | "remove"
        | "softRemove"
        | "recover"
        | "hasId"
        | "reload"
    >
> => {
    const user = await userService.getUserByEmail(email, [
        "id",
        "email",
        "password",
        "role",
        "firstName",
        "lastName",
        "referralCode",
        "createdAt",
        "updatedAt",
        "invitedBy",
        "referredUsers",
        "referredBy",
        "referrals",
        "wallet",
        "transactions",
    ]);

    if (!user || !(await isPasswordMatch(password, user.password as string))) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Incorrect email or password"
        );
    }
    return exclude(user, ["password"]);
};

const signToken = (id: string, type: string) => {
    const jwt_key: string = config.jwt.secret as string;
    const token = jwt.sign({ id, type }, jwt_key, { expiresIn: "1d" });
    return token;
};

const createSendToken = (
    user: Omit<
        User,
        | "password"
        | "save"
        | "remove"
        | "softRemove"
        | "recover"
        | "hasId"
        | "reload"
    >,
    res: Response
) => {
    const token = signToken(user.id, user.role as string);
    if (process.env.NODE_ENV === "production")
        config.cookieOptions.secure = true;
    res.cookie("jwt", token, config.cookieOptions);

    return token;
};

export default { loginWithEmailAndPassword, createSendToken };
