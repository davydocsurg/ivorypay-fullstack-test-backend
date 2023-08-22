import express from "express";
import { walletController } from "../controllers";
import { checkWallet, isAuthenticated, validate } from "../middlewares";
import { walletValidation } from "../validations";

const walletRoute = express.Router();

walletRoute.post("/create", isAuthenticated, walletController.createWallet);
walletRoute.post(
    "/deposit",
    [isAuthenticated, validate(walletValidation.deposit), checkWallet],
    walletController.depositFunds
);

export default walletRoute;
