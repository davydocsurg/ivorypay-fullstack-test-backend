import express from "express";
import authRoute from "./auth.route";
import adminRoute from "./admin.route";

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
];

defaultRoutes.forEach((route) => {
    routes.use(route.path, route.route);
});

export default routes;
