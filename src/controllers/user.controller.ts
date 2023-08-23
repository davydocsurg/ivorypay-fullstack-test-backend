import { Response } from "express";
import { AuthRequest } from "../types";
import { catchAsync } from "../utils";
import { userService } from "../services";
import { User } from "../database/entities";
import { config } from "../config";

const sendInvitations = catchAsync(async (req: AuthRequest, res: Response) => {
    const { emails } = req.body;
    const { firstName, lastName, email, referralCode } = req.user;
    const name = firstName + " " + lastName;
    const message = await userService.sendInvitations(
        name,
        email,
        emails,
        referralCode
    );

    res.send({
        message,
    });
});

/**
 * Fetch Admin user
 * @returns {Promise<User>}
 * @returns {Promise<Pick<User, Key> | null>}
 * @param {Array<Key>} keys
 */
const fetchAdmin = catchAsync(async (req: AuthRequest, res: Response) => {
    const email = config.adminEmail;
    const admin = await userService.getUserByEmail(email);
    res.send({ admin });
});

export default {
    sendInvitations,
    fetchAdmin,
};
