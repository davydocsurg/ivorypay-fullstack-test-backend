import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";
import BigDecimal from "js-big-decimal";
import { AppDataSource, logger } from "../config";
import {
    Transaction,
    TransactionEnumType,
    User,
    Wallet,
} from "../database/entities";
import { ApiError } from "../utils";
import { EntityManager } from "typeorm";

const walletRepo = AppDataSource.getRepository(Wallet);
const transactionRepo = AppDataSource.getRepository(Transaction);
const userRepo = AppDataSource.getRepository(User);

/**
 * Create a wallet
 * @param {User} user
 * @returns {Promise<Wallet>}
 */
const createWallet = async (user: User) => {
    // Check if user already has a wallet
    const existingWallet = await getWalletByAddress(
        user.wallet?.address!,
        user.id
    );
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
        id: newWallet.id,
        balance: newWallet.balance,
        address: newWallet.address,
    };

    return sanitizedWallet;
};

/**
 * Transfer funds from one wallet to another
 * @param {User} user
 * @param {string} receiverAddress
 * @param {number} amount
 * @returns {Promise<Wallet>}
 */
const transferFunds = async (
    user: User,
    recipientWallet: Wallet,
    amount: number
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

    const sanitizedWallet = {
        id: newWallet!.id,
        balance: newWallet!.balance,
        address: newWallet!.address,
    };

    const sanitizedReceiverWallet = {
        id: newReceiverWallet!.id,
        balance: newReceiverWallet!.balance,
        address: newReceiverWallet!.address,
    };

    return {
        senderWallet: sanitizedWallet,
        receiverWallet: sanitizedReceiverWallet,
    };
};

/**
 * Withdraw funds from a wallet
 * @param {EntityManager} entityManager
 * @param {User} user
 * @param {number} amount
 * @returns {Promise<Wallet>}
 */
const transactionalOperation = async (
    entityManager: EntityManager,
    fn: () => Promise<any>
): Promise<any> => {
    logger.info("Starting transaction..." + entityManager);
    const transactionalEntityManager = entityManager.transaction(fn);
    return await transactionalEntityManager;
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
    wallet: Wallet,
    amount: number,
    type: TransactionEnumType,
    otherWallet?: Wallet
): Promise<Transaction> => {
    const transaction = new Transaction();
    transaction.amount = amount;
    transaction.type = type;
    transaction.user = user;
    transaction.senderWallet = wallet;
    transaction.receiverWallet = otherWallet || wallet;

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

export default {
    createWallet,
    depositFunds,
    transferFunds,
    generateWalletAddress,
    getWalletByAddress,
    getWalletByUserId,
};
