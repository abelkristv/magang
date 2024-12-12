import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { User } from '../../domain/entities/User';

export class UserService {
  private userRepository: UserRepository = new UserRepository();

  async updateUser(
    id: string,
    data: Partial<Omit<User, 'id' | 'password'>>
  ): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    user.updateDetails(data);
    return this.userRepository.update(user);
  }

  async getUserByEmail(email: string) {
    console.log(email)
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getEmailToNameMap(emails: string[]): Promise<Record<string, string>> {
    if (!Array.isArray(emails) || emails.length === 0) {
      throw new Error('Invalid input: emails should be a non-empty array');
    }

    const users = await this.userRepository.findUsersByEmails(emails);

    const emailToNameMap: Record<string, string> = {};
    users.forEach((user) => {
      emailToNameMap[user.email] = user.name;
    });

    return emailToNameMap;
  }

  async getCurrentUser(userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
