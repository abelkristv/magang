import { Router } from 'express';
import { UserController } from '../app/controllers/UserController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const userController = new UserController();

router.use(AuthMiddleware);

router.put('/:id', (req, res) => userController.updateUser(req, res));
router.get('/email/:email', (req, res) => userController.getUserByEmail(req, res));
router.post('/names', (req, res) => userController.getNamesByEmails(req, res));

export default router;
