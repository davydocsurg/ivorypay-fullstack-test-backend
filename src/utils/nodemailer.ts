import nodemailer from "nodemailer";
import sendinblueTransport from "nodemailer-sendinblue-transport";
import httpStatus from "http-status";
import { EmailConfig } from "../types";
import ApiError from "./ApiError";
import { config } from "../config";

const apiKey = process.env.SENDINBLUE_API_KEY;

const { password, port, smtp, username, secure } = config.mailTrapOptions;
const devOptions = {
    smtp,
    port,
    secure,
    auth: {
        user: username,
        pass: password,
    },
};

let transporter = nodemailer.createTransport(
    process.env.NODE_ENV === "development"
        ? devOptions
        : new sendinblueTransport({
              apiKey,
          })
);

const NodeMailerConfig = async ({
    from,
    to,
    subject,
    text,
    html,
}: EmailConfig) => {
    const mailOptions = {
        from,
        to,
        subject,
        text,
        html,
    };

    try {
        const info = transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Email not sent. Check your connection and try again"
        );
    }
};

export default NodeMailerConfig;
