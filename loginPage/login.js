// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
  import { 
    getDatabase,
    ref,
    onValue,
  } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
  import { 
    getAuth,
    signInWithEmailAndPassword, 
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use

  // Your web app's Firebase configuration
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

  // https://firebase.google.com/docs/web/setup#available-libraries

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getDatabase();
  const auth = getAuth(app);

// Get the email input element by its ID
var email = document.getElementById('email');
// Get the password input element by its ID
var password = document.getElementById('password');

window.loginUser = function () {
  // Attempt to sign in with email and password
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(function (res) {
      // Uncomment to log the response object
      // console.log(res);

      // Retrieve user ID from the response
      var id = res.user.uid;
      // Create a reference to the user's data in the database
      var reference = ref(db, `user/${id}`);
      // Set up a listener for changes to the user's data
      onValue(reference, function (data) {
      // Uncomment to log the data value

      // console.log(data.value);

        // Redirect to the student registration form page
        window.location.href = "../studentRegistrationForm/student_registration_form.html";
      })

    })
    .catch(function (err) {
      // Show an alert with the error message if the sign-in fails
      alert(err.message);
    })

}