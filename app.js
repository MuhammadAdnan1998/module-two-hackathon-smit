// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth = getAuth();

window.toggleMenu = function () {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

// Function to update navbar visibility
function updateNavbar(user) {
    const signup = document.getElementById("signup");
    const login = document.getElementById("login");
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

window.logout = () => {
    signOut(auth)
        .then(() => {
            alert("Are You sure you want to logout?");
            localStorage.removeItem("users");
        })
        .catch((err) => {
            alert(err.message);
        });
}
