import express from "express";
import { isAuthenticated, validate } from "../middlewares";
import { authController } from "../controllers";
import { authValidation } from "../validations";

const authRoute = express.Router();

authRoute.post(
    "/register", // optionally include role
    validate(authValidation.register),
    authController.register
);
authRoute.post("/login", validate(authValidation.login), authController.login);
authRoute.post("/logout", isAuthenticated, authController.logout);

export default authRoute;
