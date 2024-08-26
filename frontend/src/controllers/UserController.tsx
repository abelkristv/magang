import { collection, getDocs, query, where } from "firebase/firestore";
import User from "../model/User";
import { db } from "../firebase";
// import { some } from "fp-ts/lib/ReadonlyRecord";
import { Option } from "fp-ts/lib/Option";
import { option } from "fp-ts";

const fetchUser = async (email: string): Promise<Option<User>> => {
    const docRef = query(collection(db, 'user'), where('email', '==', email));
    const userDocSnap = await getDocs(docRef);

    if (userDocSnap.docs[0].exists()) {
        const user = { id: userDocSnap.docs[0].id, ...userDocSnap.docs[0].data() } as User;
        return option.some(user);
    } else {
        console.log("No such document!");
        return option.none;
    }
};

export {fetchUser}