import { generateRandomUserData } from "./__mocks__/data";
import httpStatus from "http-status";
import { describe, test, expect } from "@jest/globals";
import setUpDB from "./utils/setUpDB";
import { fetchAdmin, loginUser, registerUser } from "./shared/commands";

setUpDB();

const userData = generateRandomUserData();

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
        const newUserRes = await registerUser(
            userData,
            adminRes.body.admin.referralCode
        );
        const { email, password } = newUserRes.body;
        console.log("====================================");
        console.log(email, password, newUserRes.body);
        console.log("====================================");
        const loginDetails = {
            email,
            password,
        };

        const res = await loginUser(loginDetails);
        console.log("====================================");
        console.log(res.body);
        console.log("====================================");

        expect(res.status).toBe(httpStatus.OK);
        expect(res.body).toEqual({
            ...res.body,
        });
    });
});
