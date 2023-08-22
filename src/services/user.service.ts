import httpStatus from "http-status";
import { AppDataSource, config, logger } from "../config";
import { Invitation, User } from "../database/entities";
import { ApiError, NodeMailerConfig } from "../utils";

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

/**
 * Send invitations to potential users via email
 * @param {string} senderEmail - Auth user's email
 * @param {string[]} emails - Array of user email addresses
 * @param {string} referralCode - Referral code to include in the registration link
 */
const sendInvitations = async (
    name: string,
    senderEmail: string,
    emails: string[],
    referralCode: string
) => {
    const referralLink = `${config.baseUrl}/register?${referralCode}`;
    const uniqueEmails = new Set<string>();

    for (const email of emails) {
        if (!uniqueEmails.has(email)) {
            uniqueEmails.add(email);

            const mailOptions = {
                from: {
                    name,
                    address: senderEmail,
                },
                to: email,
                subject: "Invitation to Join IvoryPayTest",
                html: `
                    <h2>You're Invited to Join IvoryPayTest!</h2>
                    <p>Hello there,</p>
                    <p>You've been invited to join IvoryPayTest, a platform that offers amazing services.</p>
                    <p>Sign up using this referral link to get started:</p>
                    <a href="${referralLink}">${referralLink}</a>
                    <p>We can't wait to have you on board!</p>
                    <p>Best regards,</p>
                    <p>${name}</p>
                `,
            };
            await NodeMailerConfig(mailOptions);
        }
    }
    return "Invitations sent successfully";
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
    sendInvitations,
};
