import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthService {
  private userRepository: UserRepository = new UserRepository();

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    return { token, user };
  }
}
