import { Router } from 'express';
import { MeetingScheduleController } from '../app/controllers/MeetingScheduleController';

const router = Router();
const scheduleController = new MeetingScheduleController();

router.post('/', (req, res) => scheduleController.getMeetingSchedules(req, res));
router.post('/create', (req, res) => scheduleController.createMeetingSchedule(req, res));
router.delete('/:meetingScheduleId', (req, res) => scheduleController.deleteMeetingSchedule(req, res));
router.put('/update', (req, res) => scheduleController.updateMeetingSchedule(req, res));

export default router;
