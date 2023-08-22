import { Response } from "express";
import { AuthRequest } from "../types";
import { catchAsync } from "../utils";
import { userService } from "../services";

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

export default {
    sendInvitations,
};
