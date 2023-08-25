import express from "express";
import { walletController } from "../controllers";
import { checkWallet, isAuthenticated, validate } from "../middlewares";
import { walletValidation } from "../validations";

const walletRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Wallet management
 */

/**
 * @swagger
 * /wallets/create:
 *   post:
 *     summary: Create a new wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet created successfully
 *       401:
 *         description: Unauthorized, please login to continue.
 *       400:
 *         description: You already have a wallet.
 */
walletRoute.post("/create", isAuthenticated, walletController.createWallet);

/**
 * @swagger
 * /wallets/deposit:
 *   post:
 *     summary: Deposit funds to a wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 items:
 *                   type: number
 *                 example: 100
 *             required:
 *               - amount
 *     responses:
 *       200:
 *         description: Funds deposited successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
walletRoute.post(
    "/deposit",
    [isAuthenticated, validate(walletValidation.deposit), checkWallet],
    walletController.depositFunds
);

/**
 * @swagger
 * /wallets/transfer:
 *   post:
 *     summary: Transfer funds between wallets
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 items:
 *                   type: number
 *                 example: 100
 *               recipientEmail:
 *                 type: string
 *                 items:
 *                   type: string
 *                   format: email
 *                 example: "hello@gmail.com"
 *             required:
 *               - amount
 *               - recipientEmail
 *     responses:
 *       200:
 *         description: Funds transferred successfully. Check your email for more details.
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 *       400:
 *        description: Insufficient funds
 */
walletRoute.post(
    "/transfer",
    [isAuthenticated, validate(walletValidation.transfer), checkWallet],
    walletController.transferFunds
);

/**
 * @swagger
 * /wallets/withdraw:
 *   post:
 *     summary: Withdraw funds from a wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 items:
 *                   type: number
 *                 example: 100
 *             required:
 *               - amount
 *     responses:
 *       200:
 *         description: Funds withdrawn successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
walletRoute.post(
    "/withdraw",
    [isAuthenticated, validate(walletValidation.withdraw), checkWallet],
    walletController.withdrawFunds
);

/**
 * @swagger
 * /wallets/transactions:
 *   post:
 *     summary: Fetch authenticated user's transactions
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *       401:
 *         description: Unauthorized
 */
walletRoute.post(
    "/transactions",
    [isAuthenticated, checkWallet],
    walletController.getTransactions
);

export default walletRoute;
