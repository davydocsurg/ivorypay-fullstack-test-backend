import { describe, test, expect } from "@jest/globals";
import { fetchAdmin, sendAdminInvitations } from "./shared/commands";
import httpStatus from "http-status";
import setUpDB from "./utils/setUpDB";

setUpDB();

describe("Fetch Admin", () => {
    test("should fetch an admin", async () => {
        const admin = await fetchAdmin();
        expect(admin.status).toBe(httpStatus.OK);
        expect(admin.body.admin).toHaveProperty("email");
    });

    test("should send invitation to potential users' email", async () => {
        const emails = [
            "john@example.com",
            "jane@example.com",
            "chioma@example.com",
        ];
        const admin = await fetchAdmin();

        const res = await sendAdminInvitations(
            emails,
            admin.body.admin.referralCode
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body).toHaveProperty("message");
    });
});
