import { Router } from 'express';
import { DocumentationController } from '../app/controllers/DocumentationController';

const router = Router();
const documentationController = new DocumentationController();

router.get('/', (req, res) => documentationController.getAllDocumentation(req, res));
router.get('/email/:email', (req, res) => documentationController.getDocumentationByEmail(req, res));
router.post('/', (req, res) => documentationController.createDocumentation(req, res));

export default router;
