import express from "express";
import { isAdmin, isAuthenticated, validate } from "../middlewares";
import { adminController } from "../controllers";
import { authValidation, userValidation } from "../validations";

const adminRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Fetch user data for admin users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       401:
 *         description: Unauthorized
 */
adminRoute.get(
    "/users",
    [isAuthenticated, isAdmin],
    adminController.fetchUsers
);

/**
 * @swagger
 * /admin/users/disable:
 *   patch:
 *     summary: Disable a user account by admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 items:
 *                   type: string
 *                   format: email
 *                 example: "ada@gmail.com"
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: User account disabled successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
adminRoute.patch(
    "/users/disable",
    [isAuthenticated, isAdmin, validate(authValidation.findUser)],
    adminController.disableUser
);

/**
 * @swagger
 * /admin/users/enable:
 *   patch:
 *     summary: Enable a user account by admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 items:
 *                   type: string
 *                   format: email
 *                 example: "ada@gmail.com"
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: User account enabled successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
adminRoute.patch(
    "/users/enable",
    [isAuthenticated, isAdmin, validate(authValidation.findUser)],
    adminController.enableUser
);

/**
 * @swagger
 * /admin/users/invitation:
 *   post:
 *     summary: Send admin invitation emails to specified recipients
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *                 example: ["hello@g.com", "ada@gmail.com"]
 *             required:
 *               - emails
 *     responses:
 *       200:
 *         description: Admin invitations sent successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
adminRoute.post(
    "/users/invitation",
    [isAuthenticated, isAdmin, validate(userValidation.invitationEmails)],
    adminController.sendAdminInvitations
);

export default adminRoute;
