// dashboard.js

// Example data store
let posts = [];

// Function to get current date and time
function getCurrentDateTime() {
    const now = new Date();
    return now.toISOString(); // Returns date in ISO format
}

// Function to handle form submission
function uploadPost(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    
    const form = document.getElementById('blogForm');
    const formData = new FormData(form);

    // Extract data from form
    const newPost = {
        id: Date.now(), // Unique ID based on current timestamp
        title: formData.get('blogTitle'),
        content: formData.get('blogContent'),
        author: formData.get('authorName'),
        date: formData.get('date'),
        image: formData.get('imageUpload').name || null, // Placeholder for image file name
        uploadTime: getCurrentDateTime()
    };

    // Add new post to the posts array
    posts.push(newPost);
    form.reset(); // Reset form fields

    // Render posts
    renderPosts();
}

// Function to delete a post
function deletePost(postId) {
    posts = posts.filter(post => post.id !== postId);
    renderPosts();
}

// Function to edit a post
function editPost(postId) {
    const post = posts.find(post => post.id === postId);
    if (post) {
        document.getElementById('blogTitle').value = post.title;
        document.getElementById('blogContent').value = post.content;
        document.getElementById('authorName').value = post.author;
        document.getElementById('date').value = post.date;
        document.getElementById('imageUpload').value = post.image || '';
        // Remove the post from the array to avoid duplication
        deletePost(postId);
    }
}

// Function to render posts list
function renderPosts() {
    const postsList = document.getElementById('postsList');
    postsList.innerHTML = '';

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('p-4', 'mb-4', 'bg-gray-200', 'rounded', 'shadow');
        postDiv.innerHTML = `
            <h3 class="text-xl font-bold">${post.title}</h3>
            <p>${post.content}</p>
            <p class="text-gray-600">Author: ${post.author}</p>
            <p class="text-gray-600">Date: ${post.date}</p>
            <p class="text-gray-600">Uploaded at: ${new Date(post.uploadTime).toLocaleString()}</p>
            <button class="bg-yellow-500 text-white px-4 py-2 rounded mt-2 mr-2" onclick="editPost(${post.id})">Edit</button>
            <button class="bg-red-500 text-white px-4 py-2 rounded mt-2" onclick="deletePost(${post.id})">Delete</button>
        `;
        postsList.appendChild(postDiv);
    });
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('blogForm');
    form.addEventListener('submit', uploadPost);
    renderPosts(); // Render posts on page load
});

// Handle logout button click
document.getElementById('logoutBtn').addEventListener('click', () => {
    console.log('Logging out...');
    window.location.href = '../index.html'; // Redirect to home page or login page
});
