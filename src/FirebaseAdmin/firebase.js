import firebase from "firebase/compat/app";
import 'firebase/auth';
import 'firebase/compat/auth'; // Add this line for compatibility mode
import 'firebase/compat/database';
import { getDatabase } from 'firebase/database'
import 'firebase/compat/storage';
import 'firebase/storage'
import 'firebase/compat/analytics';

const firebaseConfig = {
    //sas app database
    apiKey: "AIzaSyDC2YLnLe4P_vXX-fMWk2YzBs2xF4k-B5k",
    authDomain: "sasapp-a89b3.firebaseapp.com",
    databaseURL: "https://sasapp-a89b3-default-rtdb.firebaseio.com",
    projectId: "sasapp-a89b3",
    storageBucket: "sasapp-a89b3.appspot.com",
    messagingSenderId: "836038729731",
    appId: "1:836038729731:web:a1a17764c96cdf42f82e36",
    measurementId: "G-TG04DRB9FH"
  };
 
if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig);
}
  const analytics = firebase.analytics();
 const db = getDatabase();
 export { db, analytics }

 export default firebase;