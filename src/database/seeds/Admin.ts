import { logger, AppDataSource } from "../../config";
import { encryptPassword } from "../../utils";
import { User, RoleEnumType } from "../entities";
AppDataSource.initialize().then(() => {
    const seedAdmin = async () => {
        // return logger.info(userRepo.findOneBy({ email: "hello@h.com" }));
        try {
            const userRepo = AppDataSource.getRepository(User);
            // Check if admin already exists
            // const existingAdmin = await userRepo.findOneBy({
            //     email: "admin@ivorypay-test.com",
            // });
            // if (existingAdmin) {
            //     logger.info("Admin user already exists.");
            //     return;
            // }
            const admin = {
                firstName: "Admin",
                lastName: "User",
                email: "admin@ivorypay-test.com",
                password: await encryptPassword("Password1"),
                role: RoleEnumType.ADMIN,
            };
            logger.info(userRepo);
            const res = userRepo.create(admin);
            logger.info(res);
            await userRepo.save(res);
            logger.info("Admin user created.");
        } catch (error) {
            logger.error(error);
        }
    };
    console.log("====================================");
    console.log("connected", User);
    console.log("====================================");
    // seedAdmin().catch((error) => logger.error(error));
});
