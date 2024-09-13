// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAPWkKDwto7gBg0BrPI2X2_AKSgo0q5aW8",
    authDomain: "newserver-59579.firebaseapp.com",
    projectId: "newserver-59579",
    storageBucket: "newserver-59579.appspot.com",
    messagingSenderId: "608443521908",
    appId: "1:608443521908:web:613e66ecb111f7559aaa21",
    measurementId: "G-WEPX9H2SMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDB = getStorage(app)