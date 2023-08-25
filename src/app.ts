import express, { Request } from "express";
import httpStatus from "http-status";
import cors from "cors";
import { config, errorHandler, successHandler } from "./config";
import { errorConverter, gErrorHandler } from "./middlewares";
import routes from "./routes";
import { ApiError } from "./utils";

const app = express();
const allowlist = [
    "https://ivorypay-fullstack-test-frontend.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
];
// process.env.FRONT_END_URL,
const corsOptionsDelegate = function (
    req: Request,
    callback: (err: any, corsOptions: any) => void
) {
    let corsOptions: any;
    if (allowlist.indexOf(req.header("Origin")!) !== -1) {
        corsOptions = {
            origin: true,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            credentials: true,
            exposedHeaders: ["Bearer Token"],
        }; // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

if (config.env !== "test") {
    app.use(successHandler);
    app.use(errorHandler);
}

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// v1 api routes
app.use("/api/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(gErrorHandler);

export default app;
