import { Request, Response } from "express";
import httpStatus from "http-status";
import { createUser } from "../services";

const register = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, role } = req.body;
    const user = await createUser({
        email,
        password,
        firstName,
        lastName,
        role,
    });
    res.status(httpStatus.CREATED).send(user);
};

export { register };
