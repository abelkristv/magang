import { Router } from 'express';
import { EmailController } from '../app/controllers/EmailController';

const router = Router();
const emailController = new EmailController();

router.post('/', (req, res) => emailController.sendEmail(req, res));

export default router;
