// app.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth = getAuth();
const db = getDatabase(app);

// Function to fetch and display blog posts
function displayBlogs() {
    const blogsList = document.getElementById('blogsList');

    onValue(ref(db, 'posts/'), (snapshot) => {
        const data = snapshot.val();
        blogsList.innerHTML = '';

        if (data) {
            Object.values(data).forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.classList.add('p-4', 'mb-4', 'bg-gray-200', 'rounded', 'shadow');
                postDiv.innerHTML = `
                    <h3 class="text-xl font-bold">${post.title}</h3>
                    <p>${post.content}</p>
                    <p class="text-gray-600">Author: ${post.author}</p>
                    <p class="text-gray-600">Date: ${post.date}</p>
                    ${post.imageURL ? `<img src="${post.imageURL}" alt="Post Image" class="w-full h-auto mt-2 rounded" />` : ''}
                `;
                blogsList.appendChild(postDiv);
            });
        } else {
            blogsList.innerHTML = '<p>No blog posts available.</p>';
        }
    });
}

// Initialize the display of blogs when the page loads
document.addEventListener('DOMContentLoaded', displayBlogs);

// Function to toggle the mobile menu
window.toggleMenu = function () {
    document.getElementById('mobile-menu').classList.toggle('hidden');
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
    } else {
        signup.style.display = "block";
        login.style.display = "block";
        logout.style.display = "none";
        createPost.style.display = "none";
    }
}

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
    updateNavbar(user);
});

// Function to handle logout
window.logout = () => {
    signOut(auth)
        .then(() => {
            alert("You have been logged out.");
            localStorage.removeItem("users");
        })
        .catch((err) => {
            alert(err.message);
        });
};

// Function to handle post creation redirection
window.createPost = () => {
    window.location.href = 'dashboard.html';
}
