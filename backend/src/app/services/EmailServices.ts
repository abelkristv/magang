import { sendEmail } from "../../utilities/mailer";

export class EmailService {
  async sendEmail(to: string, subject: string, text: string) {
    if (!to || !subject || !text) {
      throw new Error('Missing required fields: to, subject, or text');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    try {
      const info = await sendEmail(mailOptions);
      return info.response;
    } catch (error) {
      // Narrowing the type of error
      if (error instanceof Error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }
      throw new Error('An unknown error occurred while sending email');
    }
  }
}
