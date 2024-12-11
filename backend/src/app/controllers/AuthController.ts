// src/app/controllers/AuthController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthServices';

export class AuthController {
  private authService: AuthService = new AuthService();

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    try {
      const { token, user } = await this.authService.login(email, password);
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          companyName: user.companyName,
          companyAddress: user.companyAddress,
          imageUrl: user.imageUrl,
          role: user.role,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (error) {
      console.error('Error during login:', error);

      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
}
