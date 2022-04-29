import firebase from "firebase/app";
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBbS-h2tRFGKM0ClHik5S-VakVT06MHNGM",
  authDomain: "crud-e7296.firebaseapp.com",
  projectId: "crud-e7296",
  storageBucket: "crud-e7296.appspot.com",
  messagingSenderId: "849940925310",
  appId: "1:849940925310:web:7026eb527de4d94fb1812f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export {firebase}