import { logger, AppDataSource, config, TestDataSource } from "../../config";
import { encryptPassword, generateReferralCode } from "../../utils";
import { User, RoleEnumType } from "../entities";

if (config.isTest) {
    TestDataSource.initialize().then(() => {
        const seedAdmin = async () => {
            try {
                const userRepo = TestDataSource.getRepository(User);
                // Check if admin already exists
                const existingAdmin = await userRepo.findOneBy({
                    email: "admin@ivorypay-test.com",
                });
                if (existingAdmin) {
                    logger.info("Test: Admin user already exists.");
                    return;
                }
                const admin = {
                    firstName: "Admin",
                    lastName: "User",
                    email: "admin@ivorypay-test.com",
                    password: await encryptPassword("Password1"),
                    role: RoleEnumType.ADMIN,
                    referralCode: generateReferralCode(),
                };
                const res = userRepo.create(admin);
                await userRepo.save(res);
                logger.info("Admin user created.");
            } catch (error) {
                logger.error(error);
            }
        };
        return seedAdmin();
    });
}

AppDataSource.initialize().then(() => {
    const seedAdmin = async () => {
        try {
            const userRepo = AppDataSource.getRepository(User);
            // Check if admin already exists
            const existingAdmin = await userRepo.findOneBy({
                email: "admin@ivorypay-test.com",
            });
            if (existingAdmin) {
                logger.info("Admin user already exists.");
                return;
            }
            const admin = {
                firstName: "Admin",
                lastName: "User",
                email: "admin@ivorypay-test.com",
                password: await encryptPassword("Password1"),
                role: RoleEnumType.ADMIN,
                referralCode: generateReferralCode(),
            };
            const res = userRepo.create(admin);
            await userRepo.save(res);
            logger.info("Admin user created.");
        } catch (error) {
            logger.error(error);
        }
    };
    seedAdmin();
});
