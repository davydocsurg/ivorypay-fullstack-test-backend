import httpStatus from "http-status";
import { AppDataSource } from "../config";
import { User } from "../database/entities";
import { ApiError } from "../utils";

const userRepo = AppDataSource.getRepository(User);

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

export { createUser, getUserByEmail };
