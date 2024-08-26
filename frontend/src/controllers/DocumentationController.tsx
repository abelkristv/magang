import { collection, getDocs } from "firebase/firestore";
import { Option } from "fp-ts/lib/Option";
import { db } from "../firebase";
import { option } from "fp-ts";
import Documentation from "../model/Documentation";

export const fetchAllDocumentation = async (): Promise<Option<Documentation[]>> => {
    const querySnapshot = await getDocs(collection(db, "documentation"));
    if (querySnapshot.empty) {
        return option.none;
    }
    const documentationsData = querySnapshot.docs.map(doc => {
        return {
            id: doc.id,
            ...doc.data()
        } as Documentation;
    });
    return option.some(documentationsData)
}
