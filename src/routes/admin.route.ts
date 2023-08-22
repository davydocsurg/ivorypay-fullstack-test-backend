import express from "express";
import { isAdmin, isAuthenticated, validate } from "../middlewares";
import { adminController } from "../controllers";
import { authValidation } from "../validations";

const adminRoute = express.Router();

adminRoute.get(
    "/users",
    [isAuthenticated, isAdmin],
    adminController.fetchUsers
);
adminRoute.patch(
    "/users/disable",
    [isAuthenticated, isAdmin, validate(authValidation.findUser)],
    adminController.disableUser
);
adminRoute.patch(
    "/users/enable",
    [isAuthenticated, isAdmin, validate(authValidation.findUser)],
    adminController.enableUser
);

export default adminRoute;
