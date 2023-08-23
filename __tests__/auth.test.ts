import { userData } from "./__mocks__/data";
import httpStatus from "http-status";
import { describe, test, expect } from "@jest/globals";
import setUpDB from "./utils/setUpDB";
import { fetchAdmin, registerUser } from "./shared/commands";

setUpDB();

describe("Auth routes", () => {
    test("should return 201 and successfully register user if request data is ok", async () => {
        const adminRes = await fetchAdmin();
        const res = await registerUser(userData, adminRes.body.referralCode);
        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body).toEqual({
            id: expect.anything(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
        });
    });
});
