
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');

import authRoutes from './src/routes/AuthRoutes';
import userRoutes from './src/routes/UserRoutes';
import studentRoutes from './src/routes/StudentRoutes';
import reportRoutes from './src/routes/StudentReportRoutes';
import companyRoutes from './src/routes/CompanyRoutes';
import majorRoutes from './src/routes/CompanyRoutes';
import periodRoutes from './src/routes/PeriodRoutes';
import documentationRoutes from './src/routes/DocumentationRoutes';
import scheduleRoutes from './src/routes/MeetingScheduleRoutes';
import discussionDetailRoutes from './src/routes/DiscussionDetailRoutes';
import discussionRoutes from './src/routes/DiscussionRoutes';
import recordRoutes from './src/routes/RecordRoutes';
import emailRoutes from './src/routes/EmailRoutes';
import uploadRoutes from './src/routes/StudentDataRoutes';

dotenv.config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/majors', majorRoutes);
app.use('/api/periods', periodRoutes);
app.use('/api/documentation', documentationRoutes);
app.use('/api/meeting-schedules', scheduleRoutes);
app.use('/api/discussion-details', discussionDetailRoutes);
app.use('/api/discussion', discussionRoutes);
app.use('/api/records-and-documentation', recordRoutes);
app.use('/api/send-email', emailRoutes);
app.use('/api/upload-student-data', uploadRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

