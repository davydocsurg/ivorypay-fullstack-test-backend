import { AppDataSource, logger } from "../../config";
import { encryptPassword } from "../../utils";
import { User, RoleEnumType } from "../entities";

const seedAdmin = async () => {
    const userRepo = AppDataSource.getRepository(User);
    try {
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
        };
        const res = userRepo.create(admin);
        logger.info(res);
        await userRepo.save(res);
        logger.info("Admin user created.");
    } catch (error) {
        logger.error(error);
    }
};

seedAdmin().catch((error) => logger.error(error));
