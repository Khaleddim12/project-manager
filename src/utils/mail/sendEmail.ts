import nodemailer from 'nodemailer';

const sendEmail = async (options: any, resetLink: string) => {
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST as string,
        port: Number(process.env.SMTP_PORT), // Ensure it's a number
        secure: true,
        auth: {
            user: process.env.SMTP_EMAIL as string,
            pass: process.env.SMTP_PASSWORD as string,
        },
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: `Click the following link to reset your password: ${resetLink}`,
    };

    const info = await transport.sendMail(message);

    console.log("Message sent: %s", info.messageId);
};

export default  sendEmail 