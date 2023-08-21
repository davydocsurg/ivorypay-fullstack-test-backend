import { v4 as uuidv4 } from "uuid";

const generateInvitationCode = (): string => {
    return uuidv4().replace(/-/g, "");
};

export default generateInvitationCode;
