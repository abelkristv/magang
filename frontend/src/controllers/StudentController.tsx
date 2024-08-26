import { collection, getDocs, query, where } from "firebase/firestore";
import Student from "../model/Student";
import { db } from "../firebase";
import { Option } from "fp-ts/lib/Option";
import { option } from "fp-ts";

const fetchStudents = async (companyName: string): Promise<Option<Student[]>> => {
    const querySnapshot = await getDocs(query(collection(db, "student"), where('tempat_magang', '==', companyName)));
    if (querySnapshot.empty) {
        return option.none
    }
    const studentsData =  querySnapshot.docs.map(doc => {
        // const data = doc.data();
        const id = doc.id;
        return {
            iden: id,
            ...doc.data()
        } as Student;
    });

    return option.some(studentsData)
};

const fetchAllStudents = async (): Promise<Option<Student[]>> => {
    const querySnapshot = await getDocs(collection(db, "student"));
    if (querySnapshot.empty) {
        return option.none
    }
    const studentsData = querySnapshot.docs.map(doc => {
        // const data = doc.data();
        const idt = doc.id;
        return {
            iden: idt,
            ...doc.data()
        } as Student;
    });
    return option.some(studentsData)
}

export {fetchStudents, fetchAllStudents}