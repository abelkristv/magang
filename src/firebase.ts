// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

    apiKey: "AIzaSyCJTiPQ_sIumNefU_0Ac37QUvhozB1Kk7c",
  
    authDomain: "magang-test-8a819.firebaseapp.com",
  
    projectId: "magang-test-8a819",
  
    storageBucket: "magang-test-8a819.appspot.com",
  
    messagingSenderId: "146163064963",
  
    appId: "1:146163064963:web:371b75ab1dff49381bfbb6"
  
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
