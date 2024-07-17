import { collection, getDocs, query, where } from "firebase/firestore";
import Student from "../model/Student";
import { db } from "../firebase";

const fetchStudents = async (companyName: string): Promise<Student[]> => {
    const querySnapshot = await getDocs(query(collection(db, "student"), where('tempat_magang', '==', companyName)));
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        return {
            iden: id,
            name: data.name,
            nim: data.nim,
            tempat_magang: data.tempat_magang,
            semester: data.semester,
            email: data.email,
            phone: data.phone,
            image_url: data.image_url,
            status: data.status
        } as Student;
    });
};

const fetchAllStudents = async (): Promise<Student[]> => {
    const querySnapshot = await getDocs(collection(db, "student"));
    const studentsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const idt = doc.id;
        return {
            iden: idt,
            name: data.name,
            nim: data.nim,
            tempat_magang: data.tempat_magang,
            semester: data.semester,
            email: data.email,
            phone: data.phone,
            image_url: data.image_url,
            status: data.status
        } as Student;
    });
    return studentsData
}

export {fetchStudents, fetchAllStudents}