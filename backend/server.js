const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const nodemailer = require('nodemailer');

dotenv.config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.get('/api/student/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const student = await prisma.student.findUnique({
            where: { id: id },
        });

        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/students', async (req, res) => {
    try {
        const students = await prisma.student.findMany();
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/reports', async (req, res) => {
    const { studentName, filterStartDate, filterEndDate } = req.query;

    try {
        const conditions = {
            studentName: studentName,
        };

        if (filterStartDate) {
            conditions.timestamp = {
                ...conditions.timestamp,
                gte: new Date(filterStartDate),
            };
        }

        if (filterEndDate) {
            conditions.timestamp = {
                ...conditions.timestamp,
                lte: new Date(filterEndDate),
            };
        }

        const reports = await prisma.studentReport.findMany({
            where: conditions,
        });
        // console.log(reports)

        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.put('/api/reports/:id', async (req, res) => {
    const { id } = req.params;
    const { report, type, timestamp } = req.body;

    try {
        const updatedReport = await prisma.studentReport.update({
            where: { id: id },
            data: {
                report,
                type,
                timestamp: new Date(timestamp), // Convert timestamp to Date
            },
        });

        res.json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/reports/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReport = await prisma.studentReport.delete({
            where: { id: id },
        });

        res.json({ message: 'Report deleted successfully', deletedReport });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.put('/api/student/:id/notes', async (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;

    try {
        const updatedStudent = await prisma.student.update({
            where: { id: id },
            data: { notes },
        });

        res.json(updatedStudent);
    } catch (error) {
        console.error('Error updating student notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/companies', async (req, res) => {
    try {
        const companies = await prisma.company.findMany(); 
        res.json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/majors', async (req, res) => {
    try {
        const majors = await prisma.major.findMany();
        res.json(majors);
    } catch (error) {
        console.error('Error fetching majors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/periods', async (req, res) => {
    try {
        const periods = await prisma.period.findMany(); 
        res.json(periods);
    } catch (error) {
        console.error('Error fetching periods:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/total-comments', async (req, res) => {
    const { students } = req.body;

    try {
        const newTotalComments = {};

        for (const student of students) {
            const reports = await prisma.studentReport.findMany({
                where: { studentName: student.name },
                select: { id: true },
            });

            if (reports.length > 0) {
                const reportIds = reports.map(report => report.id);

                const comments = await prisma.studentReportComment.count({
                    where: {
                        reportID: {
                            in: reportIds,
                        },
                    },
                });

                newTotalComments[student.name] = comments;
            } else {
                newTotalComments[student.name] = 0;
            }
        }

        res.json(newTotalComments);
    } catch (error) {
        console.error('Error fetching total comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/student/:id/reports/count', async (req, res) => {
    const { id } = req.params;

    try {
        const student = await prisma.student.findUnique({
            where: { id },
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const reportCount = await prisma.studentReport.count({
            where: { studentName: student.name },
        });

        res.json({ studentName: student.name, reportCount });
    } catch (error) {
        console.error('Error fetching report count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/students/search', async (req, res) => {
    const { studentName } = req.query;

    if (!studentName) {
        return res.status(400).json({ error: 'studentName query parameter is required' });
    }

    try {
        const students = await prisma.student.findMany({
            where: {
                name: {
                    contains: studentName, // Partial match search
                    mode: 'insensitive', // Case insensitive
                },
            },
        });

        if (students.length > 0) {
            res.json(students);
        } else {
            res.status(404).json({ error: 'No students found with the provided name' });
        }
    } catch (error) {
        console.error('Error fetching students by name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/documentation', async (req, res) => {
    try {
        const documentation = await prisma.documentation.findMany();
        res.json(documentation);
    } catch (error) {
        console.error('Error fetching documentation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/documentation/email/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const documentation = await prisma.documentation.findMany({
            where: { writer: email },
        });

        if (documentation.length > 0) {
            res.json(documentation);
        } else {
            res.status(404).json({ error: 'No documentation found for the provided email' });
        }
    } catch (error) {
        console.error('Error fetching documentation by email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/user/email/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await prisma.user.findFirst({
            where: { email: email },
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user by email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/user/names', async (req, res) => {
    const { emails } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({ error: 'Invalid input: emails should be a non-empty array' });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                email: {
                    in: emails,
                },
            },
            select: {
                email: true,
                name: true,
            },
        });

        const emailToNameMap = {};
        users.forEach(user => {
            emailToNameMap[user.email] = user.name;
        });

        res.json(emailToNameMap);
    } catch (error) {
        console.error('Error fetching user names:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/reports/urgent', async (req, res) => {
    try {
        const urgentReports = await prisma.studentReport.findMany({
            where: {
                type: 'Urgent',
            },
        });
        res.json(urgentReports);
    } catch (error) {
        console.error('Error fetching urgent reports:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/meeting-schedules', async (req, res) => {
    const { reportIds } = req.body;

    if (!Array.isArray(reportIds) || reportIds.length === 0) {
        return res.status(400).json({ error: 'Invalid input: reportIds should be a non-empty array' });
    }

    try {
        const schedules = {};

        for (const reportId of reportIds) {
            const meetingSchedule = await prisma.meetingSchedule.findFirst({
                where: { studentReportId: reportId },
            });

            if (meetingSchedule) {
                const studentReport = await prisma.studentReport.findUnique({
                    where: { id: reportId },
                });

                if (studentReport) {
                    meetingSchedule.writer = studentReport.writer || "Unknown";
                } else {
                    meetingSchedule.writer = "Unknown";
                }

                schedules[reportId] = meetingSchedule;
            }
        }

        res.json(schedules);
    } catch (error) {
        console.error('Error fetching meeting schedules:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/meeting-schedules/create', async (req, res) => {
    const { timeStart, timeEnd, description, place, date, meetingType, studentReportId } = req.body;

    // Validate input
    if (!timeStart || !timeEnd || !description || !place || !date || !meetingType || !studentReportId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Create a new meeting schedule entry
        const newMeeting = await prisma.meetingSchedule.create({
            data: {
                timeStart,
                timeEnd,
                description,
                place,
                date,
                type: meetingType,
                studentReportId,
                createdAt: new Date(), // Assuming you want to store the creation timestamp
            },
        });

        // Fetch updated schedules (assuming `fetchMeetingSchedules` returns the schedules by report IDs)
        const reportIds = [studentReportId]; // Fetch schedules for the current report ID
        const updatedSchedules = await prisma.meetingSchedule.findMany({
            where: {
                studentReportId: {
                    in: reportIds,
                },
            },
        });

        res.json({ message: 'Meeting scheduled successfully!', updatedSchedules });
    } catch (error) {
        console.error('Error scheduling meeting:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/discussion-details/:docID', async (req, res) => {
    const { docID } = req.params;

    try {
        const discussionDetails = await prisma.discussionDetail.findMany({
            where: {
                docId: docID,
            },
        });

        if (discussionDetails.length > 0) {
            res.json(discussionDetails);
        } else {
            res.status(404).json({ message: 'No discussion details found for the provided docID' });
        }
    } catch (error) {
        console.error('Error fetching discussion details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/discussions-with-details', async (req, res) => {
    const { docIds } = req.body;

    if (!Array.isArray(docIds) || docIds.length === 0) {
        return res.status(400).json({ error: 'docIds should be a non-empty array' });
    }

    try {
        const documents = await prisma.documentation.findMany({
            where: {
                id: {
                    in: docIds,
                },
            },
            include: {
                DiscussionDetail: true,
            },
        });

        const discussionsWithDetails = documents.map(doc => ({
            title: doc.title,
            leader: doc.leader,
            place: doc.place,
            date: doc.timestamp.toISOString().split('T')[0],
            time: doc.timestamp.toISOString().split('T')[1].split('.')[0], 
            type: doc.type,
            discussionDetails: Array.isArray(doc.discussionDetails) ? doc.discussionDetails.map(detail => detail.discussionTitle).join(', ') : '',
            attendanceList: doc.attendanceList || [],
        }));

        res.json(discussionsWithDetails);
    } catch (error) {
        console.error('Error fetching discussions with details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/records-and-documentation', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email query parameter is required' });
    }

    try {
        // Fetch urgent student reports
        const urgentReports = await prisma.studentReport.findMany({
            where: {
                type: 'Urgent',
            },
        });

        const studentDataDict = {};

        const fetchedRecords = await Promise.all(urgentReports.map(async (record) => {
            let studentData;

            if (studentDataDict[record.studentName]) {
                studentData = studentDataDict[record.studentName];
            } else {
                const students = await prisma.student.findMany({
                    where: { name: record.studentName },
                });

                if (students.length > 0) {
                    studentData = students[0]; // Assuming the first match
                    studentDataDict[record.studentName] = studentData;
                } else {
                    studentData = null;
                }
            }

            const meetingData = await prisma.meetingSchedule.findMany({
                where: { studentReportId: record.id },
            });

            const timestampDate = new Date(record.timestamp);

            return {
                ...record,
                studentData,
                imageUrl: studentData?.image_url || null,
                major: studentData?.major || null,
                meetings: meetingData,
                timestamp: {
                    seconds: Math.floor(timestampDate.getTime() / 1000),
                    nanoseconds: timestampDate.getMilliseconds() * 1e6,
                },
            };
        }));

        // Fetch documentation for the specific user by email
        const documentation = await prisma.documentation.findMany({
            where: { writer: email },
        });

        res.json({ records: fetchedRecords, documentations: documentation });
    } catch (error) {
        console.error('Error fetching records and documentation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/documentation', async (req, res) => {
    const {
        user,
        title,
        invitationNumber,
        description,
        meetingLeader,
        location,
        time,
        attendees,
        results,
        pictures,
        documentationType,
        modalDiscussionDetails
    } = req.body;

    try {
        if (!user || !user.email) {
            return res.status(400).json({ success: false, message: "User is not defined or user email is missing" });
        }

        const parsedTime = new Date(time).toISOString(); 

        console.log("Pictures array:", pictures);

        const encodedPictures = pictures.map(picture => {
            if (!picture.base64) {
                console.error("Picture file is undefined:", picture);
                throw new Error("Invalid picture data: file is undefined.");
            }

            return picture.base64;
        });


        // Save documentation to the database
        const documentation = await prisma.documentation.create({
            data: {
                title,
                nomorUndangan: invitationNumber,
                description,
                leader: meetingLeader,
                place: location,
                time: parsedTime,
                attendanceList: { set: attendees }, // Assuming array of strings
                results: { set: results }, // Assuming array of strings
                pictures: { set: encodedPictures }, // Store encoded pictures
                type: documentationType,
                writer: user.email,
                timestamp: parsedTime,
            },
        });

        await Promise.all(
            modalDiscussionDetails.map(async (detail) => {
                await prisma.discussionDetail.create({
                    data: {
                        discussionTitle: detail.discussionTitle,
                        personResponsible: detail.personResponsible,
                        furtherActions: detail.furtherActions,
                        deadline: new Date(detail.deadline).toISOString(),  // Ensure deadline is a string
                        documentation: {
                            connect: { id: documentation.id },  // Connect to the existing documentation
                        },
                    },
                });
            })
        );
        

        res.json({ success: true, message: "Documentation and discussion details added successfully!" });
    } catch (error) {
        console.error("Error adding documentation: ", error);
        res.status(500).json({ success: false, message: "Failed to add documentation. Please try again.", error });
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});

app.post('/send-email', (req, res) => {
    const { to, subject, text } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.post('/api/reports', async (req, res) => {
    const { hasRead, type, person, report, studentName, timestamp, writer } = req.body;

    // Validate the required fields
    if (!report || !studentName || !type || !person || !writer) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Create the new student report in the database
        const newReport = await prisma.studentReport.create({
            data: {
                hasRead,
                type,
                person,
                report,
                sentiment:"neutral",
                studentName,
                timestamp: new Date(timestamp), // Ensure the timestamp is properly handled
                writer,
            },
        });

        // Return a success message along with the new report
        res.status(201).json({ message: 'Student report added successfully', newReport });
    } catch (error) {
        console.error('Error adding report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/user/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phoneNumber } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: {
                name,
                email,
                phoneNumber,
            },
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

