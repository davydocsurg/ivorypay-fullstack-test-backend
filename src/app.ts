import express from "express";
import cors from "cors";
import { config, errorHandler, successHandler } from "../config";

const app = express();

if (config.env !== "test") {
    app.use(successHandler);
    app.use(errorHandler);
}

// enable cors
app.use(cors());
app.options("*", cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

export default app;
