document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.app-screens-carousel img');
    let currentScreen = 0;

    function showScreen(index) {
        screens.forEach((screen, i) => {
            if (i === index) {
                screen.classList.add('active');
            } else {
                screen.classList.remove('active');
            }
        });
    }

    function nextScreen() {
        currentScreen = (currentScreen + 1) % screens.length;
        showScreen(currentScreen);
    }

    // Show the first screen initially
    showScreen(currentScreen);

    // Auto-scroll every 3 seconds (adjust as needed)
    setInterval(nextScreen, 3000);
});

// Show sticky button on scroll
window.addEventListener('scroll', () => {
    const stickyButton = document.getElementById('sticky-download-button');
    if (window.scrollY > 200) { // Show button after scrolling down 200px
        stickyButton.classList.add('visible');
    } else {
        stickyButton.classList.remove('visible');
    }
}); 