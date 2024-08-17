// student_registration_form.js

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

window.uploadPost = function () {
  const blogTitle = document.getElementById('blogTitle').value;
  const blogContent = document.getElementById('blogContent').value;
  const authorName = document.getElementById('authorName').value;
  const date = document.getElementById('date').value;
  const imageUpload = document.getElementById('imageUpload').files[0];

  if (!blogTitle || !blogContent || !authorName || !date) {
    alert('Please fill out all required fields.');
    return;
  }

  const obj = {
    title: blogTitle,
    content: blogContent,
    author: authorName,
    date: date,
  };

  const upload = () => {
    return new Promise((resolve, reject) => {
      if (!imageUpload) {
        resolve(null);
        return;
      }
      
      const randomNum = Math.random().toString().slice(2);
      const storagePath = `images/${randomNum}`;
      const uploadRef = storageRef(storage, storagePath);
      const uploadTask = uploadBytesResumable(uploadRef, imageUpload);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log('File available at', downloadURL);
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

  upload()
    .then((url) => {
      obj.imageURL = url;
      const newPostRef = push(ref(db, 'posts/'));
      return set(newPostRef, obj);
    })
    .then(() => {
      console.log('Blog post submitted successfully');
    })
    .catch((err) => {
      console.error('Error:', err);
    });
};
