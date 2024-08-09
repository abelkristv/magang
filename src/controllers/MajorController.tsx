import { collection, getDocs } from "firebase/firestore";
import { Option } from "fp-ts/lib/Option";
import { db } from "../firebase";
import { option } from "fp-ts";

export const fetchAllMajors = async (): Promise<Option<Major[]>> => {
    const majorsCollection = collection(db, "major");
    const majorSnapshot = await getDocs(majorsCollection);
    if (majorSnapshot.empty) {
        return option.none
    }
    const majors = majorSnapshot.docs.map(doc => {
        return {
            id: doc.id,
            name: doc.data().name
        } as Major
    }
    );
    return option.some(majors)
}