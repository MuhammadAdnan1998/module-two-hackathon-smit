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
const db = getDatabase(app);

// Data Rendering Function

const container = document.getElementById("container");
let userData = [];

// Render user data to the container
function renderUserData() {
    container.innerHTML = ""; // Clear existing content
    userData.forEach(obj => {
        container.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                <img src="${obj.imageUpload}" alt="Profile Picture" class="w-24 h-24 rounded-full object-cover mb-4">
                <h5 class="text-xl font-semibold mb-2">${obj.name}</h5>
                <p class="text-gray-700 mb-2"><strong>Father's Name:</strong> ${obj.fatherName}</p>
                <p class="text-gray-700 mb-2"><strong>CNIC:</strong> ${obj.cnic}</p>
                <p class="text-gray-700 mb-2"><strong>Date of Birth:</strong> ${obj.dob}</p>
                <p class="text-gray-700 mb-2"><strong>Address:</strong> ${obj.address}</p>
                <p class="text-gray-700 mb-2"><strong>Course:</strong> ${obj.course}</p>
            </div>
        `;
    });
}

// Fetch data from Firebase and render it
function loadData() {
    const reference = ref(db, "userData");
    onValue(reference, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        if (data) {
            userData = Object.values(data);
            renderUserData();
        }
    });
}

// Load data when the script runs
loadData();