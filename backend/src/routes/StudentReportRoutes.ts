import { Router } from 'express';
import { StudentReportController } from '../app/controllers/StudentReportController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const reportController = new StudentReportController();

router.use(AuthMiddleware);

router.get('/', (req, res) => reportController.getReports(req, res));
router.post('/', (req, res) => reportController.createReport(req, res));
router.put('/:id', (req, res) => reportController.updateReport(req, res));
router.delete('/:id', (req, res) => reportController.deleteReport(req, res));
router.get('/urgent', (req, res) => reportController.getUrgentReports(req, res));
router.post('/total-comments', (req, res) => reportController.getTotalComments(req, res));

export default router;
