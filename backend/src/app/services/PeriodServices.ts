import { PeriodRepository } from '../../infrastructure/repositories/PeriodRepository';

export class PeriodService {
  private periodRepository: PeriodRepository = new PeriodRepository();

  async getAllPeriods() {
    try {
      return await this.periodRepository.findAllPeriods();
    } catch (error) {
      throw new Error('Error fetching periods');
    }
  }

  async createPeriod(name: string) {
    if (!name || !name.trim()) {
      throw new Error('Period name is required.');
    }
    return this.periodRepository.createPeriod(name.trim());
  }
}
