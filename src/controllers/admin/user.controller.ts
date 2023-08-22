import { Request, Response } from "express";
import { userService } from "../../services";
import { catchAsync } from "../../utils";
import { AuthRequest } from "../../types";

const fetchUsers = catchAsync(async (req: AuthRequest, res: Response) => {
    const users = await userService.fetchUsers();
    res.send({ users });
});

const disableUser = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await userService.disableUser(email);
    res.send({ user });
});

const enableUser = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await userService.enableUser(email);
    res.send({ user });
});

export default {
    fetchUsers,
    disableUser,
    enableUser,
};
