import { Request, Response } from 'express';
import { EmailService } from '../services/EmailServices';

export class EmailController {
  private emailService: EmailService = new EmailService();

  async sendEmail(req: Request, res: Response): Promise<void> {
    const { to, subject, text } = req.body;

    try {
      const response = await this.emailService.sendEmail(to, subject, text);
      res.status(200).json({ message: 'Email sent successfully', response });
    } catch (error) {
      console.error('Error sending email:', error);

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred while sending email' });
      }
    }
  }
}
