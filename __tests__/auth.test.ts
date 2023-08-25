import { userData, anotherUserData } from "./__mocks__/data";
import httpStatus from "http-status";
import { describe, test, expect } from "@jest/globals";
import setUpDB from "./utils/setUpDB";
import { fetchAdmin, loginUser, registerUser } from "./shared/commands";

setUpDB();

describe("Auth routes", () => {
    test("should return 201 and successfully register user if request data is ok", async () => {
        const adminRes = await fetchAdmin();
        const res = await registerUser(
            userData,
            adminRes.body.admin.referralCode
        );

        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body).toEqual({ ...res.body });
    });

    test("should return 200 and successfully login a user if request data is ok", async () => {
        const adminRes = await fetchAdmin();
        await registerUser(anotherUserData, adminRes.body.admin.referralCode);
        const { email, password } = anotherUserData;

        const res = await loginUser({ email, password });
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body).toEqual({
            ...res.body,
        });
    });

    test("should return 400 error if email is missing", async () => {
        const adminRes = await fetchAdmin();
        const res = await registerUser(
            { ...userData, email: "" },
            adminRes.body.admin.referralCode
        );

        expect(res.status).toBe(httpStatus.BAD_REQUEST);
        expect(res.body.message).toBe('"email" is not allowed to be empty');
    });
});
