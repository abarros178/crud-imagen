import firebase from "firebase/app";
import 'firebase/firestore'

const firebaseConfig = {
 apiKey: "AIzaSyAmHg0PH4s4V8zc_U8NXmquVf-WD3hjbns",
  authDomain: "crud-5e6ed.firebaseapp.com",
  projectId: "crud-5e6ed",
  storageBucket: "crud-5e6ed.appspot.com",
  messagingSenderId: "1052330145795",
  appId: "1:1052330145795:web:78d5ccda88be3105e5b636"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export {firebase}