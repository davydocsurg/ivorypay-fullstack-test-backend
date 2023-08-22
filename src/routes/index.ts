import express from "express";
import authRoute from "./auth.route";
import adminRoute from "./admin.route";
import userRoute from "./user.route";

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
];

defaultRoutes.forEach((route) => {
    routes.use(route.path, route.route);
});

export default routes;
