import Joi from "joi";
import { password } from "./custom.validation";
import { RoleEnumType } from "../database/entities";

const createUser = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        phone: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string()
            .required()
            .valid(RoleEnumType.USER, RoleEnumType.ADMIN),
    }),
};

const getUsers = {
    query: Joi.object().keys({
        role: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getUser = {
    params: Joi.object().keys({
        userId: Joi.string(),
    }),
};

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.string().required(),
    }),
    body: Joi.object()
        .keys({
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string().custom(password),
        })
        .min(1),
};

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().required(),
    }),
};

export default {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};
