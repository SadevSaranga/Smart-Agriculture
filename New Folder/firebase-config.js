// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Your project's Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCmtglyxNbz94KGLMRqMDFDDmAtNntquBs",
  authDomain: "smart-agriculture-system-fe7c6.firebaseapp.com",
  databaseURL: "https://smart-agriculture-system-fe7c6-default-rtdb.firebaseio.com",
  projectId: "smart-agriculture-system-fe7c6",
  storageBucket: "smart-agriculture-system-fe7c6.firebasestorage.app",
  messagingSenderId: "1052704207717",
  appId: "1:1052704207717:web:c89592a504d5fd11d7678c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("API Key:", firebaseConfig.apiKey);


export { auth};

