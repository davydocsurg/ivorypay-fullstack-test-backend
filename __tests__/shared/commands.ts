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

const registerUser = (data: registerDetails, params: registerParams) => {
    return server
        .get(`/api/v1/auth/register?${params.referralCode}`)
        .send(data);
};

const loginUser = ({ email, password }: loginDetails) => {
    return server.get("/api/v1/auth/login").send({
        email,
        password,
    });
};

export { fetchAdmin, loginUser, registerUser };
