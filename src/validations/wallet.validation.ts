import Joi from "joi";
import { depositAmount } from "./custom.validation";

const deposit = {
    body: Joi.object().keys({
        amount: Joi.number().required().custom(depositAmount),
    }),
};

const withdraw = {
    body: Joi.object().keys({
        amount: Joi.number().required().custom(depositAmount),
    }),
};

const transfer = {
    body: Joi.object().keys({
        amount: Joi.number().required().custom(depositAmount),
        receiverWalletId: Joi.string().required(),
    }),
};

export default {
    deposit,
    withdraw,
    transfer,
};
