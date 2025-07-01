// login.js
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "index.html"; // Redirect to home after login
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      const confirmRedirect = confirm("No account found with this email. Do you want to sign up?");
      if (confirmRedirect) {
        window.location.href = "directSignUp.php"; // Navigate to signup page
      }
    } else if (error.code === 'auth/wrong-password') {
      alert("Wrong password. Please try again.");
    } else if (error.code === 'auth/invalid-email') {
      alert("Invalid email format.");
    } else {
      alert("Login failed: " + error.message);
    }
  }
});
