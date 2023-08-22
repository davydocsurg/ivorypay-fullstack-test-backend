import express from "express";
import { validate } from "../middlewares";
import { authController } from "../controllers";
import { authValidation } from "../validations";

const authRoute = express.Router();

authRoute.post(
    "/register?:referralCode", // optionally include role
    validate(authValidation.register),
    authController.register
);
authRoute.post("/login", validate(authValidation.login), authController.login);

export default authRoute;
