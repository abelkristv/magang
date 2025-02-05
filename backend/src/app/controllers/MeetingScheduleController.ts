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

  async updateMeetingSchedule(req: Request, res: Response): Promise<void> {
    const { id, description, date, type, timeEnd, timeStart, place } = req.body;

    try {
        if (!id) {
            throw new Error('Meeting schedule ID is required');
        }

        const updatedMeeting = await this.scheduleService.updateSchedule(id, { description, timeStart, timeEnd, date, place, type });

        res.json(updatedMeeting);
    } catch (error) {
        console.error('Error updating meeting schedule:', error);

        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}


  async deleteMeetingSchedule(req: Request, res: Response): Promise<void> {
    const { meetingScheduleId } = req.params;
  
    try {
      if (!meetingScheduleId) {
        throw new Error('Meeting schedule ID is required');
      }
  
      const result = await this.scheduleService.deleteSchedule(meetingScheduleId);
      res.json(result);
    } catch (error) {
      console.error('Error deleting meeting schedule:', error);
  
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
  
}
