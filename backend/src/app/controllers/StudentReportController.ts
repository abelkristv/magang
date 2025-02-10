import { Request, Response } from 'express';
import { StudentReportService } from '../services/StudentReportServices';
import { decryptData } from '../../utilities/dhKeys';
import CryptoJS from 'crypto-js'; 
import crypto from 'crypto'; 

export class StudentReportController {
  private reportService: StudentReportService = new StudentReportService();
  private SECRET_KEY = "your-secret-key"; 

  async getReports(req: Request, res: Response): Promise<void> {
    const { studentName, filterStartDate, filterEndDate } = req.query;

    try {
      const reports = await this.reportService.getReports(
        studentName as string,
        filterStartDate as string,
        filterEndDate as string
      );
      res.json(reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
  }

  async updateReport(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { encryptedData } = req.body;

    console.log("Received encryptedData:", encryptedData); 

    const encryptedString = typeof encryptedData === "object" && "encryptedData" in encryptedData
        ? encryptedData.encryptedData
        : encryptedData;

    if (!encryptedString || typeof encryptedString !== "string" || encryptedString.trim() === "") {
        console.error("Invalid encrypted data format received");
        res.status(400).json({ error: "Invalid encrypted data format" });
        return;
    }

    try {
        
        const decryptedData = decryptData(encryptedString, this.SECRET_KEY);
        console.log("Decrypted data:", decryptedData); 

        if (!decryptedData) {
            throw new Error("Decryption failed or missing data");
        }

        
        const { reportId, ...updateData } = decryptedData; 

        console.log("Final Data Sent to Repository:", updateData); 

        const updatedReport = await this.reportService.updateReport(id, updateData);
        res.json(updatedReport);
    } catch (error) {
        console.error("Error updating report:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error" });
    }
  }

  async deleteReport(req: Request, res: Response): Promise<void> {
    const { encryptedData } = req.body;

    console.log("Received encryptedData:", encryptedData); 

    
    const encryptedString = typeof encryptedData === "object" && "encryptedData" in encryptedData
        ? encryptedData.encryptedData
        : encryptedData;

    if (!encryptedString || typeof encryptedString !== "string" || encryptedString.trim() === "") {
        console.error("Invalid encrypted data format received");
        res.status(400).json({ error: "Invalid encrypted data format" });
        return;
    }

    try {
        
        const decryptedData = decryptData(encryptedString, this.SECRET_KEY);
        console.log("Decrypted data:", decryptedData); 

        if (!decryptedData || !decryptedData.id) {
            throw new Error("Decryption failed or missing ID");
        }

        const deletedReport = await this.reportService.deleteReport(decryptedData.id);
        res.json({ message: "Report deleted successfully", deletedReport });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error" });
    }
  }



  async createReport(req: Request, res: Response): Promise<void> {
    const { encryptedData } = req.body;

    if (!encryptedData) {
      res.status(400).json({ error: "Missing encrypted data" });
      return;
    }

    try {
      
      const decryptedData = decryptData(encryptedData, this.SECRET_KEY);

      const newReport = await this.reportService.createReport(decryptedData);
      res.status(201).json({ message: 'Report added successfully', newReport });
    } catch (error) {
      console.error("Error processing encrypted report:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getUrgentReports(req: Request, res: Response): Promise<void> {
    try {
      const urgentReports = await this.reportService.getUrgentReports();
      res.json(urgentReports);
    } catch (error) {
      console.error('Error fetching urgent reports:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
  }

  async getTotalComments(req: Request, res: Response): Promise<void> {
    const { students } = req.body;

    try {
      const totalComments = await this.reportService.getTotalCommentsByStudents(students);
      res.json(totalComments);
    } catch (error) {
      console.error('Error fetching total comments:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
  }
}
