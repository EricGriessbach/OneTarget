// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";    

// Your web app's Firebase configuration
const firebaseConfig = {
      apiKey: "AIzaSyDQYXw2WywxWOEB6rWqikpNobXO2YHVs6Y",
      authDomain: "onlineexperiment-a72fb.firebaseapp.com",
      projectId: "onlineexperiment-a72fb",
      storageBucket: "onlineexperiment-a72fb.appspot.com",
      messagingSenderId: "485166807071",
      appId: "1:485166807071:web:4b24c2813702bee8e8bd2a",
      measurementId: "G-8F4R7WCGH7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Get a reference to the Auth service
const auth = getAuth(app);

let uid = null;

// Authenticate anonymously and set uid

export async function authenticate() {
  try {
    const userCredential = await signInAnonymously(auth);
    // User is signed in anonymously.
    uid = userCredential.user.uid;
    console.log("User signed in anonymously with uid: ", uid);
    return uid;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error: ", errorCode, errorMessage);
  }
}
export async function saveData(data, task) {
  if (uid) {
    try {
      await setDoc(doc(db, task, uid), { data: data });
      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  } else {
    console.error("User is not authenticated. Cannot save data.");
  }
}
