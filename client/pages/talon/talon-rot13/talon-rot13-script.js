// Golden Talon Forum Script
// Interactive features for the forum page

document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for posts to show/hide hidden comments
    const posts = document.querySelectorAll('.post');
    
    posts.forEach(post => {
        post.addEventListener('click', function() {
            const hiddenComment = this.querySelector('.hidden-comment');
            if (hiddenComment) {
                hiddenComment.style.display = hiddenComment.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
    
    // Add hover effects for posts
    posts.forEach(post => {
        post.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        post.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Add typing effect to forum header
    const forumHeader = document.querySelector('.forum-header');
    if (forumHeader) {
        const originalText = forumHeader.innerHTML;
        forumHeader.innerHTML = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                forumHeader.innerHTML += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    // Add secret console message
    console.log('%c🦅 Golden Talon Forum - Secure Channel 🦅', 'color: #ffd700; font-size: 16px; font-weight: bold;');
    console.log('%cWelcome to the secure communication channel.', 'color: #e0e0e0; font-size: 12px;');
    console.log('%cLook for hidden clues in the forum posts...', 'color: #666; font-size: 10px; font-style: italic;');
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + T for "Talon" mode (toggle golden theme)
        if (e.ctrlKey && e.key === 't') {
            document.body.classList.toggle('talon-mode');
            e.preventDefault();
        }
    });
});

// Add talon-mode styles dynamically
const style = document.createElement('style');
style.textContent = `
    .talon-mode {
        filter: sepia(1) hue-rotate(45deg) saturate(1.5);
    }
    
    .talon-mode .forum-header {
        animation: goldenGlow 2s ease-in-out infinite alternate;
    }
    
    @keyframes goldenGlow {
        from { box-shadow: 0 0 20px #ffd700; }
        to { box-shadow: 0 0 30px #ffd700, 0 0 40px #ffd700; }
    }
`;
document.head.appendChild(style);
