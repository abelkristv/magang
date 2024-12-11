import { Router } from 'express';
import { StudentController } from '../app/controllers/StudentController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const studentController = new StudentController();

router.use(AuthMiddleware);

router.get('/:id', (req, res) => studentController.getStudentById(req, res));
router.put('/:id/notes', (req, res) => studentController.updateStudentNotes(req, res));
router.get('/:id/reports/count', (req, res) => studentController.getStudentReportCount(req, res));
router.get('/search', (req, res) => studentController.searchStudents(req, res));
router.get('/', (req, res) => studentController.getStudents(req, res));

export default router;
