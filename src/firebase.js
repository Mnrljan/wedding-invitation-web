// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import getFirestore
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_4CW6h2f-ac810vRbg1fBbW4hXXtepRA",
    authDomain: "wedding-invitation-b3f09.firebaseapp.com",
    projectId: "wedding-invitation-b3f09",
    storageBucket: "wedding-invitation-b3f09.firebasestorage.app",
    messagingSenderId: "733251700755",
    appId: "1:733251700755:web:48f032496afdc6925397e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app); 
export const auth = getAuth(app);