// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Firebase configuration
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
const db = getDatabase(app);
const storage = getStorage(app);

window.uploadBlog = function () {
  // Retrieve values from the form fields
  const blogTitle = document.getElementById('blogTitle').value;
  const blogContent = document.getElementById('blogContent').value;
  const authorName = document.getElementById('authorName').value;
  const imageUpload = document.getElementById('imageUpload').files[0];

  // Get current date and time
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0];

  // Check if all required fields are filled
  if (!blogTitle || !blogContent || !authorName) {
    alert('Please fill out all required fields.');
    return;
  }

  // Create an object with the blog data
  const obj = {
    title: blogTitle,
    content: blogContent,
    author: authorName,
    date: date,
    time: time,
  };

  // Handles the image upload process to Firebase Storage and returns a promise with the download URL.
  const upload = () => {
    return new Promise((resolve, reject) => {
      // Check if there is no file selected for upload
      if (!imageUpload) {
        resolve(null);
        return;
      }

      // Generate a unique random number.
      const randomNum = Math.random().toString().slice(2);
      // Define the path in Firebase Storage where the image will be stored
      const storagePath = `images/${randomNum}`;
      // Create a reference to the storage path
      const uploadRef = storageRef(storage, storagePath);
      // Start the upload task with the selected file and the storage reference
      const uploadTask = uploadBytesResumable(uploadRef, imageUpload);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculate and log the upload progress as a percentage
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          // Log and reject the promise if an error occurs during the upload
          console.error('Upload failed:', error);
          reject(error);
        },
        () => {
          // Once upload is complete, get the download URL of the uploaded file
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              // Log and resolve the promise with the download URL
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            })
            .catch((error) => {
              // Log and reject the promise if there's an error fetching the download URL
              console.error('Failed to get download URL:', error);
              reject(error);
            });
        }
      );
    });
  };

  // Handle the result of the image upload
  upload()
    .then((url) => {
      // Add the download URL to the blog post object if available
      if (url) {
        obj.imageURL = url;
      }
      // Create a new reference for the blog post in the database and set its data
      const newPostRef = push(ref(db, 'posts/'));
      return set(newPostRef, obj);
    })
    .then(() => {
      // Log a success message once the blog post is successfully submitted
      console.log('Blog post submitted successfully');
    })
    .catch((err) => {
      // Log any errors that occur during the blog post submission
      console.error('Error:', err);
    });
};
