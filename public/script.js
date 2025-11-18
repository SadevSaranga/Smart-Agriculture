// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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
const db = getFirestore(app);
const rtdb = getDatabase(app);
const auth = getAuth(app);

export { app, db, rtdb, auth };

// script.js
import { db, rtdb, auth } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Load user info after auth
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("username").textContent = data.username || "User";
      document.getElementById("userDP").src = data.profilePicture || "./Resources/user_dp.jpg";
    } else {
      console.error("User document not found.");
    }
  } else {
    window.location.href = "login.html";
  }
});

