import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";
import { AppDataSource } from "../config";
import { User, Wallet } from "../database/entities";
import { ApiError } from "../utils";

const walletRepo = AppDataSource.getRepository(Wallet);

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
};
