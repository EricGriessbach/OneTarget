    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
    import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
    import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";    
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

    firebase.auth().signInAnonymously()
    .then((userCredential) => {
    // User is signed in anonymously.
      var uid = userCredential.user.uid;
      console.log("User signed in anonymously with uid: ", uid);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("Error: ", errorCode, errorMessage);
    });

    export async function saveData(data) {
      try {
        const docRef = await addDoc(collection(db, "experiment"), data);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }