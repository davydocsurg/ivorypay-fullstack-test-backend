import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "../services";
import { catchAsync } from "../utils";

const register = catchAsync(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, role } = req.body;
    const { invitationCode } = req.query;

    const user = await userService.createUser({
        email,
        password,
        firstName,
        lastName,
    });
    res.status(httpStatus.CREATED).send(user);
});

export default { register };
