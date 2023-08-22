import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";
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
    return wallet;
};

/**
 * Deposit funds into a wallet
 * @param {User} user
 * @param {number} amount
 * @returns {Promise<Wallet>}
 */
const depositFunds = async (user: User, amount: number) => {
    const wallet = await walletRepo.findOneBy({ user: { id: user.id } });
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, "User does not have a wallet");
    }

    wallet.balance += amount;

    await walletRepo.save(wallet);

    return createAndSaveTransaction(
        user,
        wallet,
        amount,
        TransactionEnumType.DEPOSIT
    );
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

export default {
    createWallet,
    depositFunds,
};
