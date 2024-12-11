import { Router } from 'express';
import { DiscussionDetailController } from '../app/controllers/DiscussionDetailController';

const router = Router();
const discussionDetailController = new DiscussionDetailController();

router.get('/:docID', (req, res) => discussionDetailController.getDiscussionDetails(req, res));

export default router;
