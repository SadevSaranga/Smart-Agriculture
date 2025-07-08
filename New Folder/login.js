import { auth } from './firebase-config.js';
import { 
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail, 
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Configuration for email links
const actionCodeSettings = {
  url: window.location.origin + '/login.html',
  handleCodeInApp: true
};

// Check if returning from email link
if (isSignInWithEmailLink(auth, window.location.href)) {
  handleEmailLinkSignIn();
}

// Safe message display
function showAuthMessage(message, isError = true) {
  const messageDiv = document.getElementById('auth-message');
  if (!messageDiv) {
    console.error('Message display element not found');
    return;
  }

  messageDiv.textContent = message;
  messageDiv.style.display = 'block';
  messageDiv.className = `auth-message alert alert-${isError ? 'danger' : 'success'}`;

  if (!isError) {
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  }
}

// Centralized error handling
function handleAuthError(error) {
  console.error('Authentication error:', error);
  
  switch(error.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      showAuthMessage('Invalid email or password');
      break;
    case 'auth/invalid-email':
      showAuthMessage('Please enter a valid email address');
      break;
    case 'auth/too-many-requests':
      showAuthMessage('Account temporarily locked. Try again later.');
      break;
    case 'auth/network-request-failed':
      showAuthMessage('Network error. Please check your connection.');
      break;
      case 'auth/user-not-found':
      showAuthMessage('No account found with this email. Please sign up.');
    default:
      showAuthMessage('Login failed. Please try again.');
  }
}

// Email/password login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value.trim();

  if (!email || !password) {
    showAuthMessage('Please fill in all fields');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showAuthMessage('Login successful! Redirecting...', false);
    setTimeout(() => window.location.href = 'index.html', 1500);
  } catch (error) {
    handleAuthError(error);
  }
});


// email link authentication with user existence check
document.getElementById('magic-link-btn')?.addEventListener('click', async () => {
  const email = document.getElementById('email')?.value.trim();
  if (!email) {
    showAuthMessage('Please enter your email address');
    return;
  }

  try {
    // First check if email is registered
    const methods = await fetchSignInMethodsForEmail(auth, email);
    
    if (methods.length === 0) {
      const shouldSignUp = confirm("No account found with this email. Would you like to sign up instead?");
      if (shouldSignUp) {
        window.location.href = "signup.html";
      }
      return;
    }

    // If email exists, send email link
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    showAuthMessage('Magic link sent to your email!', false);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      const shouldSignUp = confirm("No account found with this email. Would you like to sign up instead?");
      if (shouldSignUp) {
        window.location.href = "signup.html";
      }
    } else {
      handleAuthError(error);
    }
  }
});

// Password reset
document.getElementById('forgot-password')?.addEventListener('click', async () => {
  const email = document.getElementById('email')?.value.trim();
  if (!email) {
    showAuthMessage('Please enter your email to reset password');
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showAuthMessage('Password reset link sent to your email!', false);
  } catch (error) {
    handleAuthError(error);
  }
});

// Handle email link sign-in
async function handleEmailLinkSignIn() {
  let email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    email = window.prompt('Please confirm your email address:');
    if (!email) return;
  }

  try {
    await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem('emailForSignIn');
    showAuthMessage('Login successful! Redirecting...', false);
    setTimeout(() => window.location.href = 'index.html', 1500);
  } catch (error) {
    handleAuthError(error);
  }
}