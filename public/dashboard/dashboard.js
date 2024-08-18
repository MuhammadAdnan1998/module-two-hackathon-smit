import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, remove, update, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
let editMode = false;
let editPostId = null;

// Function to get current date and time
function getCurrentDateTime() {
  const now = new Date();
  return now.toISOString();
}

// Function to handle form submission (Create/Update Post)
function uploadPost(event) {
  event.preventDefault();
  
  const form = document.getElementById('blogForm');
  const formData = new FormData(form);
  const newPost = {
    title: formData.get('blogTitle'),
    content: formData.get('blogContent'),
    author: formData.get('authorName'),
    imageURL: formData.get('imageUpload').name || null, // Assuming you handle image uploads elsewhere
    uploadTime: getCurrentDateTime()
  };

  if (editMode) {
    // Update existing post
    update(ref(db, 'posts/' + editPostId), newPost).then(() => {
      resetForm();
    });
  } else {
    // Create new post
    const newPostRef = push(ref(db, 'posts/'));
    set(newPostRef, newPost);
  }

  renderPosts(); // Refresh the post list
}

// Function to delete a post
function deletePost(postId) {
  remove(ref(db, 'posts/' + postId)).then(() => {
    renderPosts(); // Refresh the post list
  });
}

// Function to edit a post
function editPost(postId) {
  editMode = true;
  editPostId = postId;

  onValue(ref(db, 'posts/' + postId), (snapshot) => {
    const post = snapshot.val();
    document.getElementById('blogTitle').value = post.title;
    document.getElementById('blogContent').value = post.content;
    document.getElementById('authorName').value = post.author;
    // The image input field cannot be set programmatically due to browser security restrictions
    // So it will remain empty, and the user can reselect the image if needed
  });
}

// Function to render posts list
function renderPosts() {
  const postsList = document.getElementById('postsList');
  postsList.innerHTML = '';

  onValue(ref(db, 'posts/'), (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const post = childSnapshot.val();
      const postDiv = document.createElement('div');
      postDiv.classList.add('p-4', 'mb-4', 'bg-gray-200', 'rounded', 'shadow');
      postDiv.innerHTML = `
        <h3 class="text-xl font-bold">${post.title}</h3>
        <p>${post.content}</p>
        <p class="text-gray-600">Author: ${post.author}</p>
        <p class="text-gray-600">Uploaded at: ${new Date(post.uploadTime).toLocaleString()}</p>
        <button class="bg-yellow-500 text-white px-4 py-2 rounded mt-2 mr-2" onclick="editPost('${childSnapshot.key}')">Edit</button>
        <button class="bg-red-500 text-white px-4 py-2 rounded mt-2" onclick="deletePost('${childSnapshot.key}')">Delete</button>
      `;
      postsList.appendChild(postDiv);
    });
  });
}

// Function to reset form and mode
function resetForm() {
  document.getElementById('blogForm').reset();
  editMode = false;
  editPostId = null;
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('blogForm');
  form.addEventListener('submit', uploadPost);
  renderPosts();
});

// Handle logout button click
document.getElementById('logoutBtn').addEventListener('click', () => {
  console.log('Logging out...');
  window.location.href = '../index.html'; // Redirect to home page or login page
});
