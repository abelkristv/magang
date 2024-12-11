import { MajorRepository } from '../../infrastructure/repositories/MajorRepository';

export class MajorService {
  private majorRepository: MajorRepository = new MajorRepository();

  async getAllMajors() {
    try {
      return await this.majorRepository.findAllMajors();
    } catch (error) {
      throw new Error('Error fetching majors');
    }
  }
}
