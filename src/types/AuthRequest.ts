import { Request } from "express";
import { User } from "../database/entities";

interface AuthRequest extends Request {
    user: User;
}

export default AuthRequest;
