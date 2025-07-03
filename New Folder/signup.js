// signup.js
import { auth } from './firebase-config.js';
import {
  createUserWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  getFirestore, doc, setDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const signUpBtn = document.getElementById('signInButton');

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.innerHTML = message;
  messageDiv.style.display = "block";

  messageDiv.style.opacity = 1;


 setTimeout(() => {
    messageDiv.style.opacity = 0;

    setTimeout(() => {
      messageDiv.style.display = "none";
  
    }, 500); 
  }, 5000);
}

signUpBtn.addEventListener('click', async (event) => {
  event.preventDefault();

  const email = document.getElementById('remail').value;
  const password = document.getElementById('rpassword').value;
  const name = document.getElementById('rname').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const db = getFirestore();
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, { email: user.email, name });

    showMessage("Account created successfully", "signUpMessage");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  } catch (error) {
    console.error("Signup error:", error.code, error.message);
    showMessage(`Signup error: ${error.message}`, "signUpMessage");
  }
});
