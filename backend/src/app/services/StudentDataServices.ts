import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";

export class StudentDataService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async saveStudentData(studentData: any[], periodYear: string): Promise<void> {
    console.log(`Saving records ${studentData.length} for period ${periodYear}`);

    if (!Array.isArray(studentData)) {
      throw new Error('Invalid student data: Expected an array');
    }

    const invalidRecords = studentData.filter((record) => {
      return !record.name || !record.nim || !record.major;
    });

    if (invalidRecords.length > 0) {
      console.error('Invalid records:', invalidRecords);
      studentData = studentData.filter((record) => record.name && record.nim && record.major);
    }

    try {
      await this.studentRepository.saveStudents(studentData);
      console.log(`Successfully saved ${studentData.length} records for period ${periodYear}`);
    } catch (error) {
      console.error(`Failed to save records for period ${periodYear}:`, error);
      throw new Error('Failed to save student data');
    }
  }

  transformStudentData = (sheets: Record<string, any[]>, periodYear: string): any[] => {
    const firstSheetName = Object.keys(sheets).find((sheetName) =>
      sheetName.toLowerCase().includes('update')
    );
    const secondSheetName = Object.keys(sheets).find((sheetName) =>
      sheetName.toLowerCase().includes('mapping fs')
    );
    const lpSheetName = Object.keys(sheets).find((sheetName) =>
      sheetName.toLowerCase().includes('lp')
    );

    if (!firstSheetName || !secondSheetName || !lpSheetName) {
      throw new Error(
        'Required sheets (Update Data, Mapping FS, and LP) are missing in the Excel file'
      );
    }

    const firstSheetData = sheets[firstSheetName];
    const secondSheetData = sheets[secondSheetName];
    const lpSheetData = sheets[lpSheetName];

    console.log(lpSheetData)

    const fsNameColumn = Object.keys(secondSheetData[0]).find((col) =>
      col.toLowerCase().includes('fs name')
    );

    const studentNameColumn = Object.keys(lpSheetData[0]).find((col) =>
      col.toLowerCase().includes('student name')
    );

    const organizationNameColumn = Object.keys(lpSheetData[0]).find((col) =>
      col.toLowerCase().includes('partner / lecturer name')
    );

    if (!organizationNameColumn) {
      throw new Error('The Organization Name column is missing in the lp sheet');
    }

    if (!studentNameColumn) {
      throw new Error('The Student Name column is missing in the lp sheet');
    }

    if (!fsNameColumn) {
      throw new Error('The FS Name column is missing in the second sheet');
    }

    // Dynamically locate the Site Supervisor Name column
    const siteSupervisorNameColumn = Object.keys(lpSheetData[0]).find((col) =>
      col.toLowerCase().includes('site supervisor name')
    );

    if (!siteSupervisorNameColumn) {
      throw new Error('The Site Supervisor Name column is missing in the LP sheet');
    }

    // Create a mapping of student names to their FS Names
    const fsNameMap: Record<string, string> = secondSheetData.reduce((map, row) => {
      const studentName = row['STUDENT NAME'] || row['StudentName']; // Handle variations in column names
      const fsName = row[fsNameColumn];
      if (studentName && fsName) {
        map[studentName.trim().toLowerCase()] = fsName.trim();
      }
      return map;
    }, {} as Record<string, string>);

    // Create a mapping of student names to their Site Supervisor Names
    const siteSupervisorMap: Record<string, string> = lpSheetData.reduce((map, row, index) => {
      const studentName = row['STUDENT NAME'] || row['StudentName'] || row[studentNameColumn]; // Handle variations in column names
      const siteSupervisorName = row[siteSupervisorNameColumn];
      console.log("site supervisor name, studentName : ", siteSupervisorName, + ' ' + studentName)

      if (!studentName) {
        console.warn(`Missing 'STUDENT NAME' in LP sheet at row ${index + 1}`);
        return map;
      }

      if (!siteSupervisorName) {
        console.warn(
          `Missing 'Site Supervisor Name' for student '${studentName}' in LP sheet at row ${index + 1}`
        );
        return map; 
      }

      map[studentName.trim().toLowerCase()] = siteSupervisorName.trim();
      return map;
    }, {} as Record<string, string>);

    const organizationNameMap: Record<string, string> = lpSheetData.reduce((map, row, index) => {
      const studentName = row['STUDENT NAME'] || row['StudentName'] || row[studentNameColumn]; // Handle variations in column names
      const organizationName = row[organizationNameColumn];

      if (!studentName) {
        console.warn(`Missing 'STUDENT NAME' in LP sheet at row ${index + 1}`);
        return map;
      }

      if (!organizationName) {
        console.warn(
          `Missing 'Site Supervisor Name' for student '${studentName}' in LP sheet at row ${index + 1}`
        );
        return map; 
      }

      map[studentName.trim().toLowerCase()] = organizationName.trim();
      return map;
    }, {} as Record<string, string>);

    // console.log('FS Name Map:', fsNameMap);
    console.log('Site Supervisor Map:', siteSupervisorMap);

    // Locate "Table6" specifically in the second sheet
    const table6StartRow = secondSheetData.findIndex((row) => Object.values(row).includes('Table6'));

    const table6Data = table6StartRow >= 0 ? secondSheetData.slice(table6StartRow + 1) : secondSheetData;

    if (table6StartRow < 0) {
      console.warn('Table6 not found explicitly in Mapping FS sheet. Processing all rows as data.');
    } else {
      // console.log(`Processing rows after Table6 (starting at row ${table6StartRow + 1})`);
    }

    // Validate and map the first sheet data to the desired structure
    return table6Data.reduce((result, row, index) => {
      const studentName = row['STUDENT NAME'] || row['StudentName'];

      if (!studentName) {
        console.warn(`Missing 'STUDENT NAME' in row ${index + 1}. Skipping this row.`);
        return result; // Skip invalid rows without throwing an error
      }

      result.push({
        name: studentName || '',
        email: row['STUDENT EMAIL'] || row['StudentEmail'] || '',
        major: row['ACADEMIC PROGRAM'] || row['StudentAcadProgDesc'] || '',
        nim: String(row['STUDENT ID'] || row['Student ID'] || ''),
        semester: '6',
        period: periodYear,
        tempatMagang: organizationNameMap[studentName.trim().toLowerCase()] || '',
        phone: String(row['STUDENT PHONE']) || row['StudentPhone'] || '',
        imageUrl: '',
        status: 'active',
        facultySupervisor: fsNameMap[studentName.trim().toLowerCase()] || '', // Assign FS Name if available
        siteSupervisor: siteSupervisorMap[studentName.trim().toLowerCase()] || '', // Assign Site Supervisor if available
      });

      return result;
    }, []);
  };
}
