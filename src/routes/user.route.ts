import express from "express";
import { isAuthenticated, validate } from "../middlewares";
import { userValidation } from "../validations";
import { userController } from "../controllers";

const userRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /users/invitation:
 *   post:
 *     summary: Send invitation emails to specified recipients
 *     tags: [User]
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
 *         description: Invitations sent successfully
 *       401:
 *         description: Unauthorized. Please login to continue.
 *       422:
 *         description: Validation error
 */
userRoute.post(
    "/invitation",
    [validate(userValidation.invitationEmails), isAuthenticated],
    userController.sendInvitations
);

/**
 * @swagger
 * /users/admin:
 *   get:
 *     summary: Fetch user data for admin users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Admin retrieved successfully
 *       401:
 *         description: Unauthorized
 */
userRoute.get("/admin", userController.fetchAdmin);

export default userRoute;
