// Golden Talon Secret Operations - Interactive Elements

document.addEventListener('DOMContentLoaded', function() {
    // Add any interactive elements here if needed
    console.log('Golden Talon Secret Operations loaded');
    
    // Optional: Add some subtle animations or effects
    addSecretEffects();
});

function addSecretEffects() {
    // Add subtle blinking effect to the warning
    const warning = document.querySelector('.warning');
    if (warning) {
        setInterval(() => {
            warning.style.opacity = warning.style.opacity === '0.7' ? '1' : '0.7';
        }, 2000);
    }
    
    // Add subtle glow effect to the flag when found
    const flag = document.querySelector('.flag');
    if (flag) {
        flag.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 10px rgba(255, 255, 0, 0.8)';
        });
        
        flag.addEventListener('mouseleave', function() {
            this.style.textShadow = '0 0 5px rgba(255, 255, 0, 0.5)';
        });
    }
}
