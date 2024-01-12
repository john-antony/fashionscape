// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {browserSessionPersistence, getAuth, setPersistence, onAuthStateChanged } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";

// const {User} = require('../mongo.js');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXEBbi7k0nTd39RX5hZlPqcgGJFjLLdKw",
  authDomain: "fashionscape-8ac02.firebaseapp.com",
  projectId: "fashionscape-8ac02",
  storageBucket: "fashionscape-8ac02.appspot.com",
  messagingSenderId: "375445051108",
  appId: "1:375445051108:web:9d878146e8c9e31a04bef1",
  measurementId: "G-969GPXW3C5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);

setPersistence(auth, browserSessionPersistence);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in.
    console.log('User is signed in:', user.uid);
  } else {
    // User is signed out.
    console.log('User is signed out');
  }
});


export default auth;