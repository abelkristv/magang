import { Request, Response } from 'express';
import { MeetingScheduleService } from '../services/MeetingScheduleServices';
import { decryptData } from '../../utilities/dhKeys';

export class MeetingScheduleController {
  private scheduleService: MeetingScheduleService = new MeetingScheduleService();
  private SECRET_KEY = "your-secret-key";

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
    const { encryptedData } = req.body;

    console.log("Received encryptedData:", encryptedData); 

    if (!encryptedData) {
        res.status(400).json({ error: "Missing encrypted data" });
        return;
    }

    try {
        const encryptedString = typeof encryptedData === "object" && "encryptedData" in encryptedData
            ? encryptedData.encryptedData
            : encryptedData;

        console.log("Extracted encrypted string:", encryptedString); 

        if (!encryptedString || typeof encryptedString !== "string" || encryptedString.trim() === "") {
            throw new Error("Invalid encrypted data format received");
        }

        const decryptedData = decryptData(encryptedString, this.SECRET_KEY);
        console.log("Decrypted createMeetingSchedule data:", decryptedData); 

        const { newMeeting, updatedSchedules } = await this.scheduleService.createSchedule(decryptedData);

        res.json({
            message: 'Meeting scheduled successfully!',
            newMeeting,
            updatedSchedules,
        });
    } catch (error) {
        console.error('Error scheduling meeting:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
  }


  async updateMeetingSchedule(req: Request, res: Response): Promise<void> {
    const { id, description, date, type, timeEnd, timeStart, place } = req.body;

    console.log(req.body)

    try {
        if (!id) {
            throw new Error('Meeting schedule ID is required');
        }
        console.log(id)

        const result = await this.scheduleService.updateSchedule(id, { 
            description, timeStart, timeEnd, date, place, type 
        });


        if (!result.updatedMeeting) {
            res.status(404).json({ error: 'Meeting schedule not found' });
            return;
        }

        console.log(result)

        res.json(result);
    } catch (error) {
        console.error('Error updating meeting schedule:', error);
        res.status(400).json({ error: error instanceof Error ? error.message : 'Internal server error' });
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
