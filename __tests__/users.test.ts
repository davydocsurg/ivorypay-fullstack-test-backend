import { describe, test, expect } from "@jest/globals";
import { fetchAdmin } from "./shared/commands";
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
