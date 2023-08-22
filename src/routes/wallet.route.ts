import express from "express";
import { walletController } from "../controllers";
import { isAuthenticated } from "../middlewares";

const walletRoute = express.Router();

walletRoute.post("/create", isAuthenticated, walletController.createWallet);

export default walletRoute;
