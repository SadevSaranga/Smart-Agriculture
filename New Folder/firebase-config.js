import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmtglyxNbz94KGLMRqMDFDDmAtNntquBs",
  authDomain: "smart-agriculture-system-fe7c6.firebaseapp.com",
  databaseURL: "https://smart-agriculture-system-fe7c6-default-rtdb.firebaseio.com",
  projectId: "smart-agriculture-system-fe7c6",
  storageBucket: "smart-agriculture-system-fe7c6.appspot.com",
  messagingSenderId: "1052704207717",
  appId: "1:1052704207717:web:c89592a504d5fd11d7678c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
