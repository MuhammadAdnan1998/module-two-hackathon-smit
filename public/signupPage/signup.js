// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ***Your web app's Firebase configuration***
const firebaseConfig = {
  apiKey: "AIzaSyBfSrcWhOPqccVC7gm2Rpdac5-Jv0gUh4I",
  authDomain: "module-two-hackathon-smit.firebaseapp.com",
  databaseURL: "https://module-two-hackathon-smit-default-rtdb.firebaseio.com",
  projectId: "module-two-hackathon-smit",
  storageBucket: "module-two-hackathon-smit.appspot.com",
  messagingSenderId: "248525104856",
  appId: "1:248525104856:web:68ded4f801b53f445e59ad",
  measurementId: "G-VXVR4RXVPS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const auth = getAuth();

// Update element IDs to match HTML
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

// ***Function to handle user sign-up***
window.signupUser = function(event) {
  // Prevent default form submission behavior
  event.preventDefault();

  // Get values from input fields
  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

// Validate password and confirm password match
if (password !== confirmPassword) {
  alert('Passwords do not match');
  return; 
  // Exit the function if passwords do not match
}

  // ***Create user with Firebase Authentication***
  createUserWithEmailAndPassword(auth, email, password)
    .then(function(userCredential) {
      // Get the user object from the userCredential
      const user = userCredential.user;

      // ***Create a user object to save in the database***
      const userObj = {
        userName: username,
        email: email,
        password: password,
        id: user.uid
      };

      // ***Save user data to Firebase Realtime Database***

      // Create a reference to the user's data in the database
      const userRef = ref(db, `users/${user.uid}`); 
      // Notify the user of successful sign-up
      return set(userRef, userObj); 
    })
    .then(function() {
      // Notify the user of successful sign-up
      alert('User signed up successfully!');
      // Clear form fields
      usernameInput.value = '';
      emailInput.value = '';
      passwordInput.value = '';
      confirmPasswordInput.value = '';
      // Redirect to the login page
      window.location.href = "../loginPage/login.html";
    })
    .catch(function(error) {
      // Extract the error message from the error object
      let errorMessage = error.message;
      // Adjust the error message format if necessary
      if (errorMessage.startsWith('Firebase: ')) {
        errorMessage = errorMessage.replace('Firebase: ', 'Error: ');
      }
      // Show an alert with the error message
      alert(errorMessage);
    });
};
