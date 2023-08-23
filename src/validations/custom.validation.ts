import Joi from "joi";

export const password: Joi.CustomValidator<string> = (value, helpers) => {
    if (value.length < 8) {
        return helpers.error("password must be at least 8 characters");
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.error(
            "password must contain at least 1 letter and 1 number"
        );
    }
    return value;
};

export const depositAmount: Joi.CustomValidator<number> = (value, helpers) => {
    if (value <= 0) {
        return helpers.error("deposit amount must be greater than 0");
    }
    return value;
};

export const withdrawAmount: Joi.CustomValidator<number> = (value, helpers) => {
    if (value < 2) {
        return helpers.error("withdraw amount must be at least $2");
    }
    return value;
};
