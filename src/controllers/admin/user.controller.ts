import { Request, Response } from "express";
import { userService } from "../../services";
import { catchAsync } from "../../utils";
import { AuthRequest } from "../../types";

const fetchUsers = catchAsync(async (req: AuthRequest, res: Response) => {
    const users = await userService.fetchUsers();
    res.send({ users });
});

const disableUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.disableUser(id);
    res.send(user);
});

const enableUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.enableUser(id);
    res.send(user);
});

export default {
    fetchUsers,
    disableUser,
    enableUser,
};
