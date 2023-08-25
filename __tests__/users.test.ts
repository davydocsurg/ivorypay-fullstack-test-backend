import { describe, test, expect } from "@jest/globals";
import {
    fetchAdmin,
    fetchUsers,
    loginUser,
    sendAdminInvitations,
} from "./shared/commands";
import httpStatus from "http-status";
import setUpDB from "./utils/setUpDB";

setUpDB();

describe("Fetch Admin", () => {
    test("should fetch an admin", async () => {
        const admin = await fetchAdmin();
        expect(admin.status).toBe(httpStatus.OK);
        expect(admin.body.admin).toHaveProperty("email");
    });
});

describe("Admin management", () => {
    test("should fetch all users", async () => {
        const adminRes = await loginUser({
            email: "admin@ivorypay-test.com",
            password: "Password1",
        });

        const { token } = adminRes.body;

        const res = await fetchUsers(token);

        console.log("====================================");
        console.log(res.body);
        console.log("====================================");
        expect(res.status).toBe(httpStatus.OK);
    });

    // test("should send invitation to potential admins' email", async () => {
    //     const emails = [
    //         "john@example.com",
    //         "jane@example.com",
    //         "chioma@example.com",
    //     ];

    //     const adminRes = await loginUser({
    //         email: "admin@ivorypay-test.com",
    //         password: "Password1",
    //     });

    //     const { token } = adminRes.body;

    //     const res = await sendAdminInvitations(
    //         emails,
    //         adminRes.body.user.referralCode,
    //         token
    //     );
    //     console.log("====================================");
    //     console.log(res.body);
    //     console.log("====================================");
    //     expect(res.status).toBe(httpStatus.OK);
    //     expect(res.body).toHaveProperty("message");
    // });
});
