import { AppDataSource } from "../config";
import { User } from "../database/entities";

const userRepository = AppDataSource.getRepository(User);

/**
 * Create a user
 * @param data - Partial<User>
 * @returns Promise<User>
 */
const createUser = async (data: Partial<User>) => {
    return await userRepository.save(userRepository.create(data));
};

export { createUser };
