import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getEnv } from './getEnv';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API'),
  authDomain: "kathas-blog.firebaseapp.com",
  projectId: "kathas-blog",
  storageBucket: "kathas-blog.firebasestorage.app",
  messagingSenderId: "338113981516",
  appId: "1:338113981516:web:0fb5948b3d1fd7eb84d8e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth,provider};