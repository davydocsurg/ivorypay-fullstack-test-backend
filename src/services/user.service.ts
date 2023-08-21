import httpStatus from "http-status";
import { AppDataSource } from "../config";
import { Invitation, User } from "../database/entities";
import { ApiError } from "../utils";

const userRepo = AppDataSource.getRepository(User);
const inviteRepo = AppDataSource.getRepository(Invitation);

/**
 * Create a user
 * @param data - Partial<User>
 * @returns Promise<User>
 */
const createUser = async (data: Partial<User>) => {
    if (await getUserByEmail(data.email!)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
    return await userRepo.save(userRepo.create(data));
};

/**
 * Get user by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof User>(
    email: string,
    keys: Key[] = [
        "id",
        "email",
        "firstName",
        "lastName",
        "password",
        "role",
        "createdAt",
        "updatedAt",
    ] as Key[]
): Promise<Pick<User, Key> | null> => {
    return userRepo.findOne({
        where: { email },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<User, Key> | null>;
};

/**
 * Verify invitation code
 * @param {string} invitationCode
 */
const verifyReferralCode = async (referralCode: string) => {
    const user = await userRepo.findOne({
        where: { referralCode },
    });
    return !!user;
};

/**
 * Create an invitation
 * @param {string} email
 * @param {string} token
 * @param {string} inviterId
 * @returns {Promise<Invitation>}
 */
const createInvitation = async (data: Partial<Invitation>) => {
    return await inviteRepo.save(inviteRepo.create(data));
};

export default {
    createUser,
    getUserByEmail,
    verifyReferralCode,
    createInvitation,
};
