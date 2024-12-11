import { Router } from 'express';
import { MajorController } from '../app/controllers/MajorController';

const router = Router();
const majorController = new MajorController();

router.get('/', (req, res) => majorController.getAllMajors(req, res));

export default router;
