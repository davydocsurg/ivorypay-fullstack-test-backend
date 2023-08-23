import request from "supertest";
import app from "../../src/app";

let server = request(app);

const fetchAdmin = () => {
    return server.get("/api/v1/users/admin");
};

export { fetchAdmin };
