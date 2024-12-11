import xlsx from 'xlsx';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';

export const processExcelFile = (filePath: string): any[] => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
};

export const processCsvFile = (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const data: any[] = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => data.push(row))
            .on('end', () => resolve(data))
            .on('error', (error) => reject(error));
    });
};

export const validateFileType = (fileName: string): boolean => {
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = path.extname(fileName).toLowerCase();
    return allowedExtensions.includes(fileExtension);
};
