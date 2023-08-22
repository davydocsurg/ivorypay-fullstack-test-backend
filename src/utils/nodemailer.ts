import nodemailer, {
    Transporter,
    SendMailOptions,
    TransportOptions,
} from "nodemailer";
import sendinblueTransport from "nodemailer-sendinblue-transport";
import httpStatus from "http-status";
import ApiError from "./ApiError";
import { config, logger } from "../config";

const apiKey = process.env.SENDINBLUE_API_KEY;

let transporter: Transporter;
const { pass, port, host, user } = config.mailTrapOptions;
const devOptions = {
    host,
    port,
    auth: {
        user,
        pass,
    },
};
if (config.env === config.DEVELOPMENT) {
    transporter = nodemailer.createTransport(devOptions as TransportOptions);
} else {
    transporter = nodemailer.createTransport(
        new sendinblueTransport({
            apiKey,
        })
    );
}

const NodeMailerConfig = async ({
    from,
    to,
    subject,
    text,
    html,
}: SendMailOptions) => {
    const mailOptions = {
        from,
        to,
        subject,
        text,
        html,
    };

    try {
        const info =
            config.env === config.DEVELOPMENT
                ? transporter.sendMail(mailOptions)
                : transporter.sendMail(mailOptions);
        return info;
    } catch (error: any) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
    }
};

export default NodeMailerConfig;
