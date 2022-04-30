import firebase from "firebase/app";
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCoHPZutlekD9I6gtmbCfLtYJt8DF_YaeQ",
  authDomain: "crud-19e61.firebaseapp.com",
  projectId: "crud-19e61",
  storageBucket: "crud-19e61.appspot.com",
  messagingSenderId: "630295244941",
  appId: "1:630295244941:web:5370842c2f8586fba272c4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export {firebase}