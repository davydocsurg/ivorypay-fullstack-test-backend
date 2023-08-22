type EmailConfig = {
    from: string;
    to: string;
    subject: string;
    html?: string;
    text?: string;
};

export default EmailConfig;
