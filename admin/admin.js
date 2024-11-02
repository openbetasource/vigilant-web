// Simple password protection (you should use proper authentication in production)
const ADMIN_PASSWORD = 'your-secure-password'; // Change this to your preferred password

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Handle login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('password').value;
        
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'dashboard.html';
        } else {
            alert('Incorrect password');
        }
    });
}

// Handle logout
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

// Handle post creation
if (document.getElementById('postForm')) {
    document.getElementById('postForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPost = {
            id: Date.now(),
            type: document.getElementById('postType').value,
            title: document.getElementById('postTitle').value,
            content: document.getElementById('postContent').value,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        // Get existing posts
        let posts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
        
        // Add new post
        posts.unshift(newPost);
        
        // Save to localStorage
        localStorage.setItem('blog-posts', JSON.stringify(posts));
        
        // Reset form and show confirmation
        this.reset();
        alert('Post published successfully!');
        
        // Refresh posts list
        loadPosts();
    });
}

// Load existing posts in admin dashboard
function loadPosts() {
    const postsList = document.getElementById('postsList');
    if (!postsList) return;

    const posts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
    
    postsList.innerHTML = posts.map(post => `
        <div class="post-item">
            <h3>${post.title}</h3>
            <p class="post-meta">${post.type.toUpperCase()} - ${post.date}</p>
            <button onclick="deletePost(${post.id})" class="delete-btn">Delete</button>
        </div>
    `).join('');
}

// Delete post
function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        let posts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
        posts = posts.filter(post => post.id !== id);
        localStorage.setItem('blog-posts', JSON.stringify(posts));
        loadPosts();
    }
}

// Initialize admin dashboard
checkAuth();
if (window.location.href.includes('dashboard.html')) {
    loadPosts();
} 