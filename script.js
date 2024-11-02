document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const posts = document.querySelectorAll('.post-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            posts.forEach(post => {
                if (filterValue === 'all') {
                    post.style.display = 'block';
                } else if (post.classList.contains(filterValue)) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });

    const readMoreButtons = document.querySelectorAll('.read-more');

    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postCard = this.closest('.post-card');
            const preview = postCard.querySelector('.post-preview');
            const fullContent = postCard.querySelector('.post-full-content');
            
            if (fullContent.classList.contains('hidden')) {
                preview.style.display = 'none';
                fullContent.classList.remove('hidden');
                postCard.classList.add('expanded');
                this.textContent = '← Read Less';
            } else {
                preview.style.display = 'block';
                fullContent.classList.add('hidden');
                postCard.classList.remove('expanded');
                this.textContent = 'Read More →';
            }
        });
    });
}); 