import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import sendinblueTransport from "nodemailer-sendinblue-transport";
import { MailtrapClient } from "mailtrap";
import httpStatus from "http-status";
import ApiError from "./ApiError";
import { config, logger } from "../config";

const apiKey = process.env.SENDINBLUE_API_KEY;
const mailtrapToken = process.env.MAILTRAP_TOKEN as string;

let mTransporter: any;
let transporter: Transporter;
if (config.env === config.DEVELOPMENT) {
    mTransporter = new MailtrapClient({
        token: mailtrapToken,
    });
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
}: SendMailOptions | any) => {
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
                ? mTransporter.send(mailOptions)
                : transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Email not sent. Check your connection and try again"
        );
    }
};

export default NodeMailerConfig;
