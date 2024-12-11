import { Router } from 'express';
import { DiscussionController } from '../app/controllers/DiscussionController';

const router = Router();
const discussionController = new DiscussionController();

router.post('/', (req, res) => discussionController.getDiscussionsWithDetails(req, res));

export default router;
