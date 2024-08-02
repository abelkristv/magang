import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Option } from "fp-ts/lib/Option";
import { option } from "fp-ts";

export const fetchAllCompanies = async (): Promise<Option<Company[]>> => {
    const querySnapshot = await getDocs(collection(db, "company"));
    if (querySnapshot.empty) {
        return option.none;
    }
    const studentsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const idt = doc.id;
        return {
            id: idt,
            ...doc.data()
        } as Company;
    });
    return option.some(studentsData)
}
