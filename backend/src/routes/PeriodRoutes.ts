import { Router } from 'express';
import { PeriodController } from '../app/controllers/PeriodController';

const router = Router();
const periodController = new PeriodController();

router.get('/', (req, res) => periodController.getAllPeriods(req, res));
router.post('/', (req, res) => periodController.createPeriod(req, res));

export default router;
