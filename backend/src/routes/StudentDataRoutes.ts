import { Router } from 'express';
import multer from 'multer';
import { StudentDataController } from '../app/controllers/StudentDataController';

const router = Router();
const upload = multer({ dest: 'uploads/' });
const studentDataController = new StudentDataController();

router.post('/', upload.single('file'), (req, res) =>
  studentDataController.uploadStudentData(req, res)
);

export default router;
