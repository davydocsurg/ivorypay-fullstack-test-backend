import nodemailer from "nodemailer";
import sendinblueTransport from "nodemailer-sendinblue-transport";
import httpStatus from "http-status";
import { EmailConfig } from "../types";
import ApiError from "./ApiError";

const apiKey = process.env.SENDINBLUE_API_KEY;
let transporter = nodemailer.createTransport(
    new sendinblueTransport({
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
