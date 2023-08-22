import { v4 as uuidv4 } from "uuid";

const generateReferralCode = (): string => {
    return uuidv4().replace(/-/g, "");
};

export default generateReferralCode;
