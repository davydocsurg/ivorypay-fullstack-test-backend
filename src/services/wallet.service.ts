import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";
import BigDecimal from "js-big-decimal";
import { AppDataSource, TestDataSource, config } from "../config";
import {
    Transaction,
    TransactionEnumType,
    User,
    Wallet,
} from "../database/entities";
import { ApiError, NodeMailerConfig } from "../utils";

const walletRepo = config.isTest
    ? TestDataSource.getRepository(Wallet)
    : AppDataSource.getRepository(Wallet);
const transactionRepo = config.isTest
    ? TestDataSource.getRepository(Transaction)
    : AppDataSource.getRepository(Transaction);
const userRepo = config.isTest
    ? TestDataSource.getRepository(User)
    : AppDataSource.getRepository(User);

/**
 * Create a wallet
 * @param {User} user
 * @returns {Promise<Wallet>}
 */
const createWallet = async (user: User) => {
    // Check if user already has a wallet
    const existingWallet = await getWalletByUserId(user.id);
    if (existingWallet) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You already have a wallet");
    }

    const wallet = walletRepo.create({
        user: { id: user.id },
        address: generateWalletAddress(),
    });
    await walletRepo.save(wallet);

    // update user entity with wallet
    user.wallet = wallet;
    await userRepo.save(user);

    return wallet;
};

/**
 * Deposit funds into a wallet
 * @param {User} user
 * @param {number} amount
 * @returns {Promise<Wallet>}
 */
const depositFunds = async (user: User, amount: number) => {
    const wallet = await getWalletByUserId(user.id);
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, "User does not have a wallet");
    }

    const newWallet = await updateWalletBalance(wallet, amount, "add");

    const sanitizedWallet = {
        id: newWallet!.id,
        balance: newWallet!.balance,
        address: newWallet!.address,
    };

    return sanitizedWallet;
};

/**
 * Transfer funds from one wallet to another
 * @param {User} user
 * @param {Wallet} recipientWallet
 * @param {number} amount
 * @param {string|null} recipientEmail
 * @returns {Promise<Wallet>}
 */
const transferFunds = async (
    user: User,
    recipientWallet: Wallet,
    amount: number,
    recipientEmail?: string
) => {
    const wallet = await getWalletByUserId(user.id);
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, "User does not have a wallet");
    }

    // Deduct amount from sender's wallet
    const newWallet = await updateWalletBalance(wallet, amount, "subtract");

    // And add to receiver's wallet
    const newReceiverWallet = await updateWalletBalance(
        recipientWallet,
        amount,
        "add"
    );

    // Create transaction
    const transaction = await createAndSaveTransaction(
        user,
        amount,
        TransactionEnumType.TRANSFER,
        wallet,
        recipientWallet
    );

    if (transaction) {
        await sendTransactionNotification(
            user,
            recipientEmail!,
            TransactionEnumType.TRANSFER
        );
    }

    const sanitizedTransaction = {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        createdAt: transaction.createdAt,
    };
    const sanitizedWallet = {
        id: newWallet!.id,
        balance: newWallet!.balance,
        address: newWallet!.address,
        transaction: sanitizedTransaction,
    };

    const sanitizedReceiverWallet = {
        id: newReceiverWallet!.id,
        balance: newReceiverWallet!.balance,
        address: newReceiverWallet!.address,
        transaction: sanitizedTransaction,
    };

    return {
        senderWallet: sanitizedWallet,
        receiverWallet: sanitizedReceiverWallet,
    };
};

/**
 * Withdraw funds from a wallet
 * @param {User} user
 * @param {number} amount
 * @returns {Promise<Wallet>}
 */
const withdrawFunds = async (user: User, amount: number) => {
    const wallet = await getWalletByUserId(user.id);
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, "User does not have a wallet");
    }

    const newWallet = await updateWalletBalance(wallet, amount, "subtract");
    return newWallet;
};

/**
 * Create and save a transaction
 * @param entityManager
 * @param user
 * @param wallet
 * @param amount
 * @param type
 * @param otherWallet
 * @returns {Promise<Transaction>}
 */
const createAndSaveTransaction = async (
    user: User,
    amount: number,
    type: TransactionEnumType,
    senderWallet: Wallet,
    receiverWallet: Wallet
): Promise<Transaction> => {
    const transaction = new Transaction();
    transaction.amount = amount;
    transaction.type = type;
    transaction.user = user;
    transaction.senderWallet = senderWallet;
    transaction.receiverWallet = receiverWallet;

    return transactionRepo.save(transaction);
};

/**
 * Generate a new wallet address
 *
 */
const generateWalletAddress = () => {
    return uuidv4().replace(/-/g, "");
};

/**
 * Update a wallet's balance
 * @param {Wallet} wallet
 * @param {number} amount
 * @param {string<'add' | 'subtract'>} type
 * @returns {Promise<Wallet>}
 */
const updateWalletBalance = async (
    userWallet: Wallet,
    amount: number,
    type: "add" | "subtract"
): Promise<Wallet | null> => {
    // Use BigDecimal for precise arithmetic calculations
    const walletBalance = new BigDecimal(userWallet!.balance.toString());
    const operationAmount = new BigDecimal(amount.toString());
    let newWalletBalance: BigDecimal;

    if (type === "add") {
        newWalletBalance = walletBalance.add(operationAmount);
        userWallet.balance = parseFloat(newWalletBalance!.getValue());

        return await walletRepo.save(userWallet);
    } else if (type === "subtract") {
        if (walletBalance.compareTo(operationAmount) < 0) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient funds");
        }
        newWalletBalance = walletBalance.subtract(operationAmount);
        userWallet.balance = parseFloat(newWalletBalance!.getValue());

        return await walletRepo.save(userWallet);
    }
    return null;
};

/**
 * Fetch a wallet by address
 * @param {string} address
 * @param {string} userId
 * @returns {Promise<Wallet | null>}
 */
const getWalletByAddress = async (address: string, userId: string) => {
    return await walletRepo.findOne({
        where: { address, user: { id: userId } },
    });
};

/**
 * Fetch a wallet by user id
 * @param {string} userId
 * @returns {Promise<Wallet | null>}
 */
const getWalletByUserId = async (userId: string) => {
    return await walletRepo.findOne({
        where: { user: { id: userId } },
    });
};

/**
 * Send notification to both users when a transaction is made
 * @param {User} sender
 * @param {User} recipient
 * @param {TransactionEnumType} type
 * @returns {Promise<void>}
 */
const sendTransactionNotification = async (
    sender: User,
    recipientEmail: string,
    type: TransactionEnumType
) => {
    const senderMailOptions = {
        from: config.systemMail,
        to: sender.email,
        subject: "Transaction Notification",
        text: `You have made a ${type} transaction to ${recipientEmail}`,
    };

    const recipientMailOptions = {
        from: config.systemMail,
        to: recipientEmail,
        subject: "Transaction Notification",
        text: `You have received a ${type} transaction from ${sender.email}`,
    };

    // Send mail to sender
    await NodeMailerConfig(senderMailOptions);

    // Send mail to recipient
    await NodeMailerConfig(recipientMailOptions);
};

export default {
    createWallet,
    depositFunds,
    transferFunds,
    generateWalletAddress,
    getWalletByAddress,
    getWalletByUserId,
    withdrawFunds,
};
