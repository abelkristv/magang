import { Request, Response } from 'express';
import { MeetingScheduleService } from '../services/MeetingScheduleServices';

export class MeetingScheduleController {
  private scheduleService: MeetingScheduleService = new MeetingScheduleService();

  async getMeetingSchedules(req: Request, res: Response): Promise<void> {
    const { reportIds } = req.body;

    try {
      const schedules = await this.scheduleService.getMeetingSchedules(reportIds);
      res.json(schedules);
    } catch (error) {
      console.error('Error fetching meeting schedules:', error);

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async createMeetingSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { newMeeting, updatedSchedules } = await this.scheduleService.createSchedule(req.body);

      res.json({
        message: 'Meeting scheduled successfully!',
        newMeeting,
        updatedSchedules,
      });
    } catch (error) {
      console.error('Error scheduling meeting:', error);

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
