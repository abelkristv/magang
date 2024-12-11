import { CompanyRepository } from '../../infrastructure/repositories/CompanyRepository';

export class CompanyService {
  private companyRepository: CompanyRepository = new CompanyRepository();

  async getAllCompanies() {
    try {
      return await this.companyRepository.findAllCompanies();
    } catch (error) {
      throw new Error('Error fetching companies');
    }
  }
}
