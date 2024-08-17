// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

function updateNavbar(user) {
    const logout = document.getElementById("logout");

    if (user) {
        signup.style.display = "none";
        login.style.display = "none";
        logout.style.display = "block";
    } else {
        signup.style.display = "block";
        login.style.display = "block";
        logout.style.display = "none";
    }
}

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
    updateNavbar(user);
});

// Data Rendering Function

var blogContainer = document.getElementById("blog-container");
var blogData = [];

function renderBlogData() {
    blogContainer.innerHTML = '';  // Clear the container before rendering

    for (let i = 0; i < blogData.length; i++) {
        var obj = blogData[i];

        blogContainer.innerHTML += `<div class="bg-white p-6 rounded-lg shadow-md flex flex-col">
                <h2 class="text-2xl font-bold mb-2">${obj.blogTitle}</h2>
                <p class="text-gray-600 mb-4">${obj.blogContent}</p>
                <p class="text-gray-700"><strong>Author:</strong> ${obj.authorName}</p>
                <p class="text-gray-700"><strong>Date:</strong> ${obj.date}</p>
            </div>`;
    };
};

function loadBlogData() {
    var reference = ref(db, "userData");
    onValue(reference, function (data) {
        if (data.val()) {
            blogData = Object.values(data.val());
            renderBlogData();
        };
    });
}

loadBlogData();
