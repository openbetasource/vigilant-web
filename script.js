document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const postsContainer = document.querySelector('.posts');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const activeFilters = document.querySelector('.active-filters');
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
                tags: doc.querySelector('meta[name="post-tags"]')?.content.split(',') || [],
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
            'posts/news/my-second-news-post.html'
            // Add new post files here
            // You can also fetch this list from a directory if your server supports it
        ];

        const posts = await Promise.all(
            postFiles.map(file => fetchPostMetadata(file))
        );

        return posts.filter(post => post !== null);
    }

    // Search functionality
    function searchPosts(posts, searchTerm) {
        return posts.filter(post => {
            const searchContent = `${post.title} ${post.preview} ${post.tags.join(' ')} ${post.category}`.toLowerCase();
            return searchContent.includes(searchTerm.toLowerCase());
        });
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
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });
    }

    // Enhanced display function with animations
    function displayPosts(posts, filter = 'all', selectedTag = null) {
        postsContainer.innerHTML = '';
        
        const filteredPosts = posts.filter(post => {
            return (filter === 'all' || filter === post.type) && 
                   (!selectedTag || post.tags.includes(selectedTag));
        });

        filteredPosts.forEach((post, index) => {
            const postElement = document.createElement('article');
            postElement.className = `post-card ${post.type}`;
            postElement.style.animationDelay = `${index * 0.1}s`;
            
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
                <div class="post-tags">
                    ${post.tags.map(tag => `
                        <span class="tag" data-tag="${tag}">#${tag}</span>
                    `).join('')}
                </div>
                <a href="${post.link}" class="read-more">Read More →</a>
            `;
            
            postsContainer.appendChild(postElement);
        });

        // Show no results message if needed
        if (filteredPosts.length === 0) {
            postsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No posts found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
        }
    }

    // Event listeners
    searchInput.addEventListener('input', debounce(function() {
        const searchResults = searchPosts(currentPosts, this.value);
        const sortBy = sortSelect.value;
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        displayPosts(sortPosts(searchResults, sortBy), activeFilter);
        updateActiveFilters();
    }, 300));

    sortSelect.addEventListener('change', function() {
        const sortedPosts = sortPosts(currentPosts, this.value);
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        displayPosts(sortedPosts, activeFilter);
    });

    // Initialize
    loadAllPosts().then(posts => {
        currentPosts = posts;
        displayPosts(sortPosts(posts, 'date-desc'), 'all');
    });

    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}); 