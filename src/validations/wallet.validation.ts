import Joi from "joi";
import {
    depositAmount,
    transferAmount,
    withdrawAmount,
} from "./custom.validation";

const deposit = {
    body: Joi.object().keys({
        amount: Joi.number().required().custom(depositAmount),
    }),
};

const withdraw = {
    body: Joi.object().keys({
        amount: Joi.number().required().custom(withdrawAmount),
    }),
};

const transfer = {
    body: Joi.object().keys({
        amount: Joi.number().required().custom(transferAmount),
        recipientEmail: Joi.string().email().required(),
    }),
};

export default {
    deposit,
    withdraw,
    transfer,
};
