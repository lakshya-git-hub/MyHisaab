// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {
    // Optional: Remove loader if not desired in new design
    const loader = document.querySelector('.loader');
    if (loader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 500);
            }, 500); // Shorter delay
        });
    }
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (hamburger && navLinks && authButtons) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            authButtons.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    authButtons.classList.remove('active');
                }
            });
        });
    }
    
    // Pricing tabs toggle - REMOVED as per new design
    
    // Testimonial carousel - Will be replaced with grid logic or removed if not animated
    // Keeping basic visibility toggle for now
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    // If you want a carousel, new logic will be needed here.
    // If it's a static grid, no JS is needed for display.
    
    // Smooth scrolling for anchor links using GSAP ScrollToPlugin
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                gsap.to(window, {
                    duration: 0.8, // Adjusted duration
                    scrollTo: {
                        y: targetElement,
                        offsetY: 70 // Adjust offset if needed for fixed header
                    },
                    ease: 'power2.inOut'
                });
                
                // Close mobile menu after clicking a link
                if (window.innerWidth <= 768) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    authButtons.classList.remove('active');
                }
            }
        });
    });
    
    // Scroll reveal animation using GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%', // Adjust start point as needed
                toggleActions: 'play none none none' // Play animation once
            },
            opacity: 0,
            y: 50, // Slide up effect
            duration: 1,
            ease: 'power2.out'
        });
    });
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-switch');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        themeToggle.checked = savedTheme === 'light';
    } else {
        // Set dark mode as default if no saved theme preference
        const initialTheme = 'dark';
        htmlElement.setAttribute('data-theme', initialTheme);
        // The checkbox should be unchecked for dark mode
        themeToggle.checked = false;
        localStorage.setItem('theme', initialTheme);
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            themeToggle.checked = newTheme === 'light';
        }
    });
    
    // Form submission handling (keeping basic functionality)
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && validateEmail(email)) {
                // Here you would typically send the data to your server
                alert('Thank you for subscribing! We\'ll keep you updated.');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
    
    // Email validation helper (keeping functionality)
    function validateEmail(email) {
        const re = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
        return re.test(email);
    }
    
    // Remove tooltip functionality as it doesn't match new design
    // Remove sticky navbar effect if not desired (navbar is fixed in new design)

    // Removed Testimonial Infinite Scroll

    // Mobile App Promotion Section Animations
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
        createParticles();
        initMobileAppAnimations();
    }
});

function createParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;

        // Random size
        const size = Math.random() * 3 + 1;
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        
        // Random delay
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            left: ${posX}%;
            top: ${posY}%;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 215, 0, ${Math.random() * 0.5});
            border-radius: 50%;
            pointer-events: none;
            animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
        `;
        
        particlesContainer.appendChild(particle);
            }
}

function initMobileAppAnimations() {
    // GSAP animations for the mobile app section
    gsap.from('.phone-mockup', {
        scrollTrigger: {
            trigger: '.mobile-app-promo',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        x: -100,
    opacity: 0,
        duration: 1,
        ease: 'power3.out'
});

    gsap.from('.app-info', {
        scrollTrigger: {
            trigger: '.mobile-app-promo',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        x: 100,
    opacity: 0,
        duration: 1,
        ease: 'power3.out'
});

    // Removed GSAP animation for .store-btn to ensure they are visible immediately
    // gsap.from('.store-btn', {
    //     scrollTrigger: {
    //         trigger: '.mobile-app-promo',
    //         start: 'top bottom', // Start animation when the top of the section hits the bottom of the viewport
    //         toggleActions: 'play none none reverse', // Play animation once, reverse on scroll up
    //         // Ensure the initial state is applied immediately if already in view on load
    //         immediateRender: true,
    //     },
    //     y: 30, // Animate from slightly lower position
    //     opacity: 0, // Animate from invisible
    //     duration: 0.8,
    //     stagger: 0.15, // Slightly reduce stagger for potentially faster appearance
    //     ease: 'power2.out' // Use a standard ease
    // });
}

// Add this to your existing CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0%, 100% {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(100px, 50px);
        }
        50% {
            transform: translate(50px, 100px);
        }
        75% {
            transform: translate(-50px, 50px);
        }
    }
`;
document.head.appendChild(style);