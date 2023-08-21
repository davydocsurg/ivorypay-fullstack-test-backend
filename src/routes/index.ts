import express from "express";
import authRoute from "./auth.route";

const routes = express.Router();

const defaultRoutes = [
    {
        path: "/auth",
        route: authRoute,
    },
];

defaultRoutes.forEach((route) => {
    routes.use(route.path, route.route);
});

export default routes;
