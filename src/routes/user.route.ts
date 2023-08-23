import express from "express";
import { isAuthenticated, validate } from "../middlewares";
import { userValidation } from "../validations";
import { userController } from "../controllers";

const userRoute = express.Router();

userRoute.post(
    "/invitation",
    [validate(userValidation.invitationEmails), isAuthenticated],
    userController.sendInvitations
);

userRoute.get("/admin", userController.fetchAdmin);

export default userRoute;
