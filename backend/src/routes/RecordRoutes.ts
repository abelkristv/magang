import { Router } from 'express';
import { RecordController } from '../app/controllers/RecordController';

const router = Router();
const recordController = new RecordController();

router.get('/', (req, res) => recordController.getRecordsAndDocumentation(req, res));

export default router;
