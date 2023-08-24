import request from "supertest";
import app from "../../src/app";

let server = request(app);

interface loginDetails {
    email: string;
    password: string;
}

interface registerDetails extends loginDetails {
    firstName: string;
    lastName: string;
}

interface registerParams {
    referralCode: string;
    role?: string;
}

const fetchAdmin = () => {
    return server.get("/api/v1/users/admin");
};

const registerUser = (data: registerDetails, referralCode: string) => {
    return server
        .post(`/api/v1/auth/register?referralCode=${referralCode}`)
        .send(data);
};

const loginUser = (data: loginDetails) => {
    return server.post("/api/v1/auth/login").send({ ...data });
};

const sendAdminInvitations = (
    emails: string[],
    referralCode: string,
    role = "admin"
) => {
    return server
        .post(
            `/api/v1/admin/users/invitation?referral-code=${referralCode}&role=${role}`
        )
        .send({ emails });
};

export { fetchAdmin, loginUser, registerUser, sendAdminInvitations };
