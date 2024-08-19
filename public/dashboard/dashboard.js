import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, remove, update, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
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
    imageURL: null, // This will be updated after image upload if applicable
    uploadTime: getCurrentDateTime()
  };

  uploadImage(formData.get('imageUpload'))
    .then((url) => {
      if (url) {
        newPost.imageURL = url;
      }
      if (editMode) {
        // Update existing post
        return update(ref(db, 'posts/' + editPostId), newPost);
      } else {
        // Create new post
        const newPostRef = push(ref(db, 'posts/'));
        return set(newPostRef, newPost);
      }
    })
    .then(() => {
      resetForm();
      renderPosts(); // Refresh the post list
    })
    .catch((err) => {
      console.error('Error:', err);
    });
}

// Function to upload image and get download URL
function uploadImage(imageFile) {
  return new Promise((resolve, reject) => {
    if (!imageFile) {
      resolve(null);
      return;
    }

    const randomNum = Math.random().toString().slice(2);
    const storagePath = `images/${randomNum}`;
    const uploadRef = storageRef(storage, storagePath);
    const uploadTask = uploadBytesResumable(uploadRef, imageFile);

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
      postDiv.classList.add('post');

      const editBtn = document.createElement('button');
      editBtn.classList.add('post-edit-btn');
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => editPost(childSnapshot.key));

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('post-delete-btn');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => deletePost(childSnapshot.key));

      postDiv.innerHTML = `
        <h3 class="post-title">${post.title}</h3>
        <p class="post-content">${post.content}</p>
        <p class="post-author">Author: ${post.author}</p>
        <p class="post-time">Uploaded at: ${new Date(post.uploadTime).toLocaleString()}</p>
      `;

      postDiv.appendChild(editBtn);
      postDiv.appendChild(deleteBtn);
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
