import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app); // Correctly initialize Firebase Storage

// Reference to the image file in Firebase Storage
const imageRef = storageRef(storage, 'path/to/your/image.jpg'); // Correctly reference the image

// Get the download URL
getDownloadURL(imageRef).then((url) => {
  // Set the image src to the download URL
  document.getElementById('firebase-image').src = url;
}).catch((error) => {
  console.error('Error getting download URL:', error);
});

// Function to convert ISO string to a readable time format
function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

// Function to fetch and display blog posts
function displayBlogs() {
  const blogsList = document.getElementById('blogsList');

  onValue(ref(db, 'posts/'), (snapshot) => {
    const data = snapshot.val();
    blogsList.innerHTML = '';

    if (data) {
      const postsArray = Object.keys(data).map(postId => ({ id: postId, ...data[postId] }));
      
      // Sort posts by uploadTime
      postsArray.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));

      postsArray.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('blog-card');
        
        // Limit content length for display
        const shortContent = post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;

        postDiv.innerHTML = `
          <img src="${post.imageURL || 'https://via.placeholder.com/150'}" alt="Post Image">
          <h2>${post.title}</h2>
          <p class="author">Author: ${post.author}</p>
          <p class="date">Date: ${formatDateTime(post.uploadTime)}</p>
          <p class="content">${shortContent} <a href="#" class="read-more" data-id="${post.id}">Read more</a></p>
        `;
        blogsList.appendChild(postDiv);
      });

      // Add event listeners for 'Read more' links
      document.querySelectorAll('.read-more').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const postId = link.getAttribute('data-id');
          const fullContent = postsArray.find(post => post.id === postId).content;
          link.parentElement.innerHTML = fullContent; // Replace preview text with full content
        });
      });
    } else {
      blogsList.innerHTML = '<p>No blog posts available.</p>';
    }
  });
}

// Initialize the display of blogs when the page loads
document.addEventListener('DOMContentLoaded', displayBlogs);

// Function to check if the user is logged in
function isUserLoggedIn() {
  return localStorage.getItem('loggedIn') === 'true';
}

// Function to handle the 'Create a new post' button click
function createPost() {
  if (isUserLoggedIn()) {
    // User is logged in, show the registration form
    showRegistrationForm();
  } else {
    // User is not logged in, redirect to the signup page
    window.location.href = '/signupPage/signup.html';
  }
}

// Attaching event listeners to elements
document.getElementById('create-post').addEventListener('click', createPost);
document.getElementById('logout').addEventListener('click', logout);

// Function to toggle the mobile menu
window.toggleMenu = function () {
  document.getElementById('mobile-menu').classList.toggle('hidden');
}

// Function to display the registration form
function showRegistrationForm() {
  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
      registrationForm.classList.remove('hidden'); // Show the form
  } else {
      console.error('Registration form not found!');
  }
}

// Function to handle user logout
function logout() {
  localStorage.setItem('loggedIn', 'false');
  signOut(auth)
    .then(() => {
      alert("You have been logged out.");
      window.location.reload();
    })
    .catch((err) => {
      alert(err.message);
    });
}

// Function to update navbar visibility based on auth state
function updateNavbar(user) {
  const signup = document.getElementById("signup");
  const login = document.getElementById("login");
  const logout = document.getElementById("logout");
  const createPost = document.getElementById("create-post");

  if (user) {
    signup.style.display = "none";
    login.style.display = "none";
    logout.style.display = "block";
    createPost.style.display = "block";
    localStorage.setItem('loggedIn', 'true');
  } else {
    signup.style.display = "block";
    login.style.display = "block";
    logout.style.display = "none";
    createPost.style.display = "none";
    localStorage.setItem('loggedIn', 'false');
  }
}

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
  updateNavbar(user);
});
