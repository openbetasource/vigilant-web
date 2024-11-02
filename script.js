document.addEventListener('DOMContentLoaded', function() {
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const postsContainer = document.querySelector('.posts');

    // List of all your posts with their metadata
    const posts = [
        {
            title: "My First Blog Post",
            type: "blog",
            date: "November 2, 2024",
            preview: "Welcome to my first blog post! I'm excited to share my journey in web development.",
            link: "posts/blog/my-first-blog-post.html"
        },
        {
            title: "My First News Post",
            type: "news",
            date: "November 2, 2024",
            preview: "Welcome to my first news post! I'm excited to share my journey in web development.",
            link: "posts/news/my-first-news-post.html"
        },
        {
            title: "My Second News Post",
            type: "news",
            date: "November 2, 2024",
            preview: "Welcome to my second news post! I'm excited to share my journey in web development.",
            link: "posts/news/my-second-news-post.html"
        }
        // Add more posts here as you create them
    ];

    // Function to display posts
    function displayPosts(filter = 'all') {
        postsContainer.innerHTML = ''; // Clear existing posts

        posts.forEach(post => {
            if (filter === 'all' || filter === post.type) {
                const postElement = `
                    <article class="post-card ${post.type}">
                        <div class="post-tag">${post.type.toUpperCase()}</div>
                        <div class="post-date">${post.date}</div>
                        <h3>${post.title}</h3>
                        <div class="post-preview">
                            <p>${post.preview}</p>
                        </div>
                        <a href="${post.link}" class="read-more">Read More →</a>
                    </article>
                `;
                postsContainer.innerHTML += postElement;
            }
        });
    }

    // Add click handlers to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            displayPosts(button.getAttribute('data-filter'));
        });
    });

    // Initial load of all posts
    displayPosts('all');
}); 