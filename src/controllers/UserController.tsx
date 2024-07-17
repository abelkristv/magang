import { collection, getDocs, query, where } from "firebase/firestore";
import User from "../model/User";
import { db } from "../firebase";

const fetchUser = async (email: string): Promise<User | null> => {
    const docRef = query(collection(db, 'user'), where('email', '==', email));
    const userDocSnap = await getDocs(docRef);

    if (userDocSnap.docs[0].exists()) {
        const user = { id: userDocSnap.docs[0].id, ...userDocSnap.docs[0].data() } as User;
        return user;
    } else {
        console.log("No such document!");
        return null;
    }
};

export {fetchUser}