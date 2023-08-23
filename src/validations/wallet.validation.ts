import Joi from "joi";
import { depositAmount, withdrawAmount } from "./custom.validation";

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
        amount: Joi.number().required().custom(withdrawAmount),
        recipientEmail: Joi.string().email().required(),
    }),
};

export default {
    deposit,
    withdraw,
    transfer,
};
