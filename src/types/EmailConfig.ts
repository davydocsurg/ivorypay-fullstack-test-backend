type EmailConfig = {
    from: string | Object;
    to: string;
    subject: string;
    html?: string;
    text?: string;
};

export default EmailConfig;
