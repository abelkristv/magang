import { Router } from 'express';
import { MeetingScheduleController } from '../app/controllers/MeetingScheduleController';

const router = Router();
const scheduleController = new MeetingScheduleController();

router.post('/', (req, res) => scheduleController.getMeetingSchedules(req, res));
router.post('/create', (req, res) => scheduleController.createMeetingSchedule(req, res));

export default router;
