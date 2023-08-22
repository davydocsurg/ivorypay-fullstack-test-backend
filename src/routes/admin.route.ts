import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares";
import { adminController } from "../controllers";

const adminRoute = express.Router();

adminRoute.get(
    "/users",
    [isAuthenticated, isAdmin],
    adminController.fetchUsers
);

export default adminRoute;
