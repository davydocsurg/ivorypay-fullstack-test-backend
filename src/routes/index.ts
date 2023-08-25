import express from "express";
import authRoute from "./auth.route";
import adminRoute from "./admin.route";
import userRoute from "./user.route";
import walletRoute from "./wallet.route";
import docsRoute from "./docs.route";
import { config } from "../config";

const routes = express.Router();

const defaultRoutes = [
    {
        path: "/auth",
        route: authRoute,
    },
    {
        path: "/admin",
        route: adminRoute,
    },
    {
        path: "/users",
        route: userRoute,
    },
    {
        path: "/wallets",
        route: walletRoute,
    },
];

const devRoutes = [
    // routes available only in development mode
    {
        path: "/docs",
        route: docsRoute,
    },
];

defaultRoutes.forEach((route) => {
    routes.use(route.path, route.route);
});

if (config.env === "development") {
    devRoutes.forEach((route) => {
        routes.use(route.path, route.route);
    });
}

export default routes;
