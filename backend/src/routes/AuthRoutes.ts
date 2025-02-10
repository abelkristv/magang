
import express, { Router } from 'express';
import cors from 'cors';
import { AuthController } from '../app/controllers/AuthController';


const router: Router = express.Router();
const authController = new AuthController();

router.use(cors());
router.use(express.json({ limit: '100mb' }));
router.use(express.urlencoded({ limit: '100mb', extended: true }));

router.post('/login', (req, res) => authController.login(req, res));

export default router;
