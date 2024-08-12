// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getDatabase,
  ref,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getStorage,
  ref as storageRef, // Rename to avoid naming conflicts with 'ref'
  uploadBytesResumable,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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

// Initialize Firebase with the provided configuration
const app = initializeApp(firebaseConfig);
// Optional: Used for analytics tracking
const analytics = getAnalytics(app);
// Get a reference to the Firebase Realtime Database
const db = getDatabase(app);
// Get a reference to Firebase Storage
const storage = getStorage(app);

// Function to handle form submission and image upload
window.uploadPost = function () {
// Fetch values from form elements
var name = document.getElementById('name').value;
var fatherName = document.getElementById('fatherName').value; // Corrected ID
var cnic = document.getElementById('cnic').value;
var dob = document.getElementById('dob').value;
var address = document.getElementById('address').value;
var course = document.getElementById('course').value;
var imageUpload = document.getElementById('imageUpload'); // Reference to file input element

// Create an object with the form data
var obj = {
  name: name,
  fatherName: fatherName,
  cnic: cnic,
  dob: dob,
  address: address,
  course: course,
};

  // Validation to ensure that all required fields are filled out
  if (!obj.name || !obj.fatherName || !obj.cnic || !obj.dob || !obj.address || !obj.course) {
    alert('Please fill out all required fields.');
    return; // Stop execution if any field is empty
  }

// Function to handle image file upload
let uploads = () => {
  return new Promise((resolve, reject) => {
    let files = imageUpload.files[0];
    if (!files) {
      alert('Please select an image to upload.');
      return;
    }
    console.log(files);
    // Create a unique path for the image in storage
    const randomNum = Math.random().toString().slice(2);
    const storageRefPath = `images/${randomNum}`;

    // Create a reference to the storage location and start the upload
    const uploadRef = storageRef(storage, storageRefPath);
    const uploadTask = uploadBytesResumable(uploadRef, files);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Monitor upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('Upload failed:', error);
        reject(error);
      },
      () => {
        // Handle successful uploads and get the download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("File available at", downloadURL);
            resolve(downloadURL);
          })
          .catch((error) => {
            console.error('Failed to get download URL:', error);
            reject(error);
          });
      }
    );
  });
};

// Save form data to Firebase Realtime Database
var newStudentRegistration = push(ref(db, "studentData"));
set(newStudentRegistration, obj)
  .then(function () {
    console.log("Registration Form Submitted Successfully");
  })
  .catch(function (err) {
    console.error("Error Submitting Registration Form : ", err);
  });

  // Upload image and handle URL retrieval
  uploads()
    .then((url) => {
      var product = { imageUrl: url };
      // Optionally: Save or use the image URL
      console.log(product);
    })
    .catch((err) => {
      console.error('Upload Error:', err);
    });
};
