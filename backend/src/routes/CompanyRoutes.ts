import { Router } from 'express';
import { CompanyController } from '../app/controllers/CompanyController';

const router = Router();
const companyController = new CompanyController();

router.get('/', (req, res) => companyController.getAllCompanies(req, res));

export default router;
