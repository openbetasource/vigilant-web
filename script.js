document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const postsContainer = document.querySelector('.posts');
    const sortSelect = document.getElementById('sortSelect');
    let currentPosts = [];

    // Function to fetch and parse HTML files
    async function fetchPostMetadata(url) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            return {
                title: doc.title.replace(' - StarBloat', ''),
                type: doc.querySelector('meta[name="post-type"]').content,
                date: doc.querySelector('meta[name="post-date"]').content,
                preview: doc.querySelector('meta[name="post-preview"]').content,
                category: doc.querySelector('meta[name="post-category"]')?.content,
                link: url
            };
        } catch (error) {
            console.error(`Error loading post from ${url}:`, error);
            return null;
        }
    }

    // Function to load all posts
    async function loadAllPosts() {
        const postFiles = [
            'posts/blog/my-first-blog-post.html',
            'posts/news/my-first-news-post.html',
            // Add new post files here
        ];

        const posts = await Promise.all(
            postFiles.map(file => fetchPostMetadata(file))
        );

        return posts.filter(post => post !== null);
    }

    // Sort functionality
    function sortPosts(posts, sortBy) {
        return [...posts].sort((a, b) => {
            switch(sortBy) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'category':
                    return (a.category || '').localeCompare(b.category || '');
                default:
                    return 0;
            }
        });
    }

    // Display function with animations
    function displayPosts(posts, filter = 'all') {
        postsContainer.innerHTML = '';
        
        const filteredPosts = posts.filter(post => {
            return filter === 'all' || filter === post.type;
        });

        filteredPosts.forEach((post, index) => {
            const postElement = document.createElement('article');
            postElement.className = `post-card ${post.type}`;
            postElement.style.animationDelay = `${index * 0.1}s`;
            postElement.style.cursor = 'pointer';
            
            postElement.innerHTML = `
                <div class="post-tag">${post.type.toUpperCase()}</div>
                <div class="post-meta">
                    <span class="post-date">${post.date}</span>
                    ${post.category ? `<span class="post-category">${post.category}</span>` : ''}
                </div>
                <h3>${post.title}</h3>
                <div class="post-preview">
                    <p>${post.preview}</p>
                </div>
                <span class="read-more">Read More →</span>
            `;
            
            postElement.addEventListener('click', () => {
                window.location.href = post.link;
            });
            
            postsContainer.appendChild(postElement);
        });
    }

    // Event listeners
    sortSelect.addEventListener('change', function() {
        const sortedPosts = sortPosts(currentPosts, this.value);
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        displayPosts(sortedPosts, activeFilter);
    });

    // Filter button listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            displayPosts(currentPosts, button.getAttribute('data-filter'));
        });
    });

    // Initialize
    loadAllPosts().then(posts => {
        currentPosts = posts;
        displayPosts(sortPosts(posts, 'date-desc'), 'all');
    });
}); 