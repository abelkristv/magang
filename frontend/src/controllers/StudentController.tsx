// import { PrismaClient } from '@prisma/client';
import Student from "../model/Student";
import { Option } from "fp-ts/lib/Option";
import { option } from "fp-ts";
// const prisma = new PrismaClient();

// const fetchStudents = async (companyName: string): Promise<Option<Student[]>> => {
//     try {
//         const studentsData = await prisma.student.findMany({
//             where: {
//                 tempatMagang: companyName,
//             },
//         });

//         if (studentsData.length === 0) {
//             return option.none;
//         }

//         const formattedStudentsData = studentsData.map(student => ({
//             iden: student.id.toString(),  // Convert the ID to a string if necessary
//             name: student.name,
//             nim: student.nim,
//             semester: student.semester,
//             tempat_magang: student.tempatMagang,
//             email: student.email,
//             phone: student.phone,
//             image_url: student.imageUrl,
//             status: student.status,
//             faculty_supervisor: student.facultySupervisor,
//             site_supervisor: student.siteSupervisor,
//             major: student.major,
//             notes: student.notes,
//             period: student.period,
//         }));

//         return option.some(formattedStudentsData);
//     } catch (error) {
//         console.error('Error fetching students:', error);
//         return option.none;
//     } finally {
//         await prisma.$disconnect();
//     }
// };

export interface PaginatedResponse {
    students: Student[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalStudents: number;
        limit: number;
    };
}
const fetchAllStudents = async (page: number = 1, limit: number = 9): Promise<Option<PaginatedResponse>> => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/student?page=${page}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
            }
        );

        if (response.status !== 200) {
            console.error("Error fetching students from API:", response.status);
            return option.none;
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (!data.students || !data.pagination || typeof data.pagination.totalStudents === "undefined") {
            console.error("Unexpected API response structure:", data);
            return option.none;
        }

        const studentsData = data.students.map((student: any) => ({
            iden: student.id.toString(),
            name: student.name,
            nim: student.nim,
            semester: student.semester,
            tempat_magang: student.tempatMagang,
            email: student.email,
            phone: student.phone,
            image_url: student.imageUrl,
            status: student.status,
            faculty_supervisor: student.facultySupervisor,
            site_supervisor: student.siteSupervisor,
            major: student.major,
            notes: student.notes,
            period: student.period,
        } as Student));

        return option.some({
            students: studentsData,
            pagination: {
                ...data.pagination,
                totalStudents: data.pagination.totalStudents, // Ensure totalStudents is returned
            },
        });
    } catch (error) {
        console.error("Error fetching students from API:", error);
        return option.none;
    }
};


export const fetchStudentById = async (studentId: string): Promise<Option<Student>> => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/student/${studentId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
            }
        );
        
        if (response.status === 404) {
            console.error("No such student!");
            return option.none;
        }

        const data = await response.json();
        return option.some({
            iden: data.id.toString(),
            name: data.name,
            nim: data.nim,
            tempat_magang: data.tempatMagang,
            semester: data.semester,
            email: data.email,
            phone: data.phone,
            image_url: data.imageUrl,
            status: data.status,
            major: data.major,
            faculty_supervisor: data.facultySupervisor,
            site_supervisor: data.siteSupervisor,
            notes: data.notes,
            period: data.period,
        } as Student);
    } catch (error) {
        console.error("Error fetching student:", error);
        return option.none;
    }
};

export const updateStudentNotes = async (
    studentId: string,
    notes: string,
    student: Student | null
): Promise<Student | null> => {
    if (!student) {
        return null;
    }
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/student/${studentId}/notes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ notes }),
        });

        if (!response.ok) {
            throw new Error(`Error updating notes: ${response.statusText}`);
        }

        const updatedStudent = await response.json();

        // alert("Notes updated successfully!");
        return { ...student, notes: updatedStudent.notes };
    } catch (error) {
        console.error("Error updating notes:", error);
        // alert("Failed to update notes. Please try again.");
        throw error;
    }
};

const fetchStudentsByName = async (studentName: string, page: number = 1, limit: number = 10): Promise<Option<PaginatedResponse>> => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/student/search?studentName=${encodeURIComponent(studentName)}&page=${page}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                console.error("No students found with the provided name.");
                return option.none;
            }
            throw new Error(`Error fetching students: ${response.statusText}`);
        }

        const data = await response.json();

        return option.some({
            students: data.students.map((student: any) => ({
                iden: student.id.toString(),
                name: student.name,
                nim: student.nim,
                semester: student.semester,
                tempat_magang: student.tempatMagang,
                email: student.email,
                phone: student.phone,
                image_url: student.imageUrl,
                status: student.status,
                faculty_supervisor: student.facultySupervisor,
                site_supervisor: student.siteSupervisor,
                major: student.major,
                notes: student.notes,
                period: student.period,
            })),
            pagination: data.pagination,
        });
    } catch (error) {
        console.error("Error fetching students by name:", error);
        return option.none;
    }
};

const fetchStudentsWithFilters = async (
    page: number = 1,
    limit: number = 9,
    name?: string,
    period?: string
): Promise<Option<PaginatedResponse>> => {
    const token = localStorage.getItem('token');
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (name) {
            params.append("name", name);
        }

        if (period) {
            params.append("period", period);
        }

        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/student?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                console.error("No students found.");
                return option.none;
            }
            throw new Error(`Error fetching students: ${response.statusText}`);
        }

        const data = await response.json();

        return option.some({
            students: data.students.map((student: any) => ({
                iden: student.id.toString(),
                name: student.name,
                nim: student.nim,
                semester: student.semester,
                tempat_magang: student.tempatMagang,
                email: student.email,
                phone: student.phone,
                image_url: student.imageUrl,
                status: student.status,
                faculty_supervisor: student.facultySupervisor,
                site_supervisor: student.siteSupervisor,
                major: student.major,
                notes: student.notes,
                period: student.period,
            })),
            pagination: data.pagination,
        });
    } catch (error) {
        console.error("Error fetching students with filters:", error);
        return option.none;
    }
};


export { fetchAllStudents, fetchStudentsByName, fetchStudentsWithFilters };
