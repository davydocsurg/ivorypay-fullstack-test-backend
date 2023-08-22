import crypto from "crypto";
import httpStatus from "http-status";
import { AppDataSource, config } from "../config";
import { Otp } from "../database/entities";
import NodeMailerConfig from "./nodemailer";
import ApiError from "./ApiError";

const otpRepo = AppDataSource.getRepository(Otp);
const generateOTP = async (email: string) => {
    const otp = crypto.randomBytes(6).toString("hex"); // Generate a 6-digit OTP
    const newOtp = otpRepo.create({ email, otp });
    await otpRepo.save(newOtp);
    return otp;
};

const sendOTP = async (email: string) => {
    const otp = await generateOTP(email);
    const sentOTP = await NodeMailerConfig({
        from: config.systemMail,
        to: email,
        subject: "IvoryPayTest - Verify your email",
        html: `
            <h2>Verify your email address</h2>

        Please enter the following OTP to verify your email address: <strong>${otp}.</strong>
        <small> This OTP will expire in 10 minutes. </small>
        `,
    });

    return sentOTP;
};

const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    const Otp = await otpRepo.findOne({
        where: {
            email,
            otp,
        },
    });
    if (!Otp) {
        return false;
    }

    // Check if the OTP has expired
    const expiry = Otp.createdAt.getTime() + 10 * 60 * 1000; // 10 minutes in milliseconds
    if (Date.now() > expiry) {
        await otpRepo.remove(Otp); // Remove the expired OTP from the database
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "OTP has expired. Please request a new OTP."
        ); // OTP has expired
    }

    await otpRepo.remove(Otp); // Delete the OTP from the database

    return true;
};

export default {
    generateOTP,
    verifyOTP,
    sendOTP,
};
