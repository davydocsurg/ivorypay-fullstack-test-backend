import httpStatus from "http-status";
import { AppDataSource, logger } from "../config";
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
 * Fetch all users
 * @returns {Promise<User[]>}
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key>[]>}
 */
const fetchUsers = async <Key extends keyof User>(
    keys: Key[] = [
        "id",
        "email",
        "firstName",
        "lastName",
        "password",
        "role",
        "createdAt",
        "updatedAt",
        "isActive",
    ] as Key[]
): Promise<Pick<User, Key>[]> => {
    return userRepo.find({
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<User, Key>[]>;
};

/**
 * Disable a user
 * @param {string} email
 * @returns {Promise<User>}
 * @returns {Promise<Pick<User, Key> | null>}
 */
const disableUser = async <Key extends keyof User>(
    email: string
): Promise<Pick<User, Key> | null> => {
    const user = await getUserByEmail(email);
    logger.info(user?.email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    user.isActive = false;
    return await userRepo.save(user);
};

/**
 * Enable a user
 * @param {string} email
 * @returns {Promise<User>}
 * @returns {Promise<Pick<User, Key> | null>}
 */
const enableUser = async <Key extends keyof User>(
    email: string
): Promise<Pick<User, Key> | null> => {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    user.isActive = true;
    return await userRepo.save(user);
};

/**
 * Get user by id
 * @param {string} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserById = async <Key extends keyof User>(
    id: string,
    keys: Key[] = [
        "id",
        "email",
        "firstName",
        "lastName",
        "password",
        "role",
        "createdAt",
        "updatedAt",
        "isActive",
    ] as Key[]
): Promise<Pick<User, Key> | null> => {
    const user = userRepo.findOne({
        where: { id },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<User, Key> | null>;
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    return user;
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
        "isActive",
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

/**
 * Check if user is active before login
 * @param {string} email
 * @returns {Promise<boolean>}
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const checkUserIsActive = async (email: string) => {
    const user = await userRepo.findOne({
        where: { email },
        select: ["isActive"],
    });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return user.isActive;
};

export default {
    createUser,
    getUserByEmail,
    verifyReferralCode,
    createInvitation,
    fetchUsers,
    disableUser,
    enableUser,
    checkUserIsActive,
};
