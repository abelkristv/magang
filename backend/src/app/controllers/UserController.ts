import { Request, Response } from 'express';
import { UserService } from '../services/UserServices';

export class UserController {
  private userService: UserService = new UserService();

  async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const {
      name,
      email,
      companyName,
      companyAddress,
      imageUrl,
      role,
      phoneNumber,
    } = req.body;

    try {
      console.log('Authenticated user:', req.user);

      const updatedUser = await this.userService.updateUser(id, {
        name,
        email,
        companyName,
        companyAddress,
        imageUrl,
        role,
        phoneNumber,
      });
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    const { email } = req.params;

    try {
      const user = await this.userService.getUserByEmail(email);
      res.json(user);
    } catch (error) {
      console.error('Error fetching user by email:', error);

      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getNamesByEmails(req: Request, res: Response): Promise<void> {
    const { emails } = req.body;

    try {
      const emailToNameMap = await this.userService.getEmailToNameMap(emails);
      res.json(emailToNameMap);
    } catch (error) {
      console.error('Error fetching user names:', error);

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; // `req.user` is properly typed now
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
  
      const user = await this.userService.getCurrentUser(userId);
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error('Error fetching current user:', error);
  
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
  
  
}
