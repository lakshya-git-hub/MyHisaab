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
        const initialTheme = systemPrefersDark ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', initialTheme);
        themeToggle.checked = initialTheme === 'light';
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

    // Testimonial Infinite Scroll
    const testimonialsContainer = document.querySelector('.testimonials-container');
    if (testimonialsContainer) {
        // Duplicate the content for a seamless loop
        const testimonialContent = testimonialsContainer.innerHTML;
        testimonialsContainer.innerHTML += testimonialContent;

        let scrollPosition = 0;
        const scrollSpeed = 0.5; // Adjust speed as needed

        // Calculate the width of a single testimonial card including its gap
        const firstCard = testimonialsContainer.querySelector('.testimonial-card');
        // Use clientWidth which excludes borders and scrollbars, offsetWidth includes border and padding
        // Let's use offsetWidth as it's more likely to represent the full visual width including padding/border for flex items
        const cardWidth = firstCard.offsetWidth;
        // Get the computed gap value
        const gap = parseFloat(window.getComputedStyle(testimonialsContainer).gap) || 30; // Default to 30px if gap is not set or parse fails
        const cardAndGapWidth = cardWidth + gap;

        // The point at which to reset the scroll: the total width of the original set of cards including gaps
        // We have 5 original cards. The total width before duplication is 5 cards + 4 gaps.
        // However, the container scrolls the full width including the last gap of the original set before the duplicated set starts.
        // The total scrollable width before the duplicate starts is the width of the first 5 cards plus the 5 gaps *following* them in the flex layout.
        // A simpler approach is to scroll the total width of the original content (5 cards and their gaps).
        // Let's calculate based on the number of original children (which is half the total children after duplication).
        const numberOfOriginalCards = testimonialsContainer.children.length / 2;
        const originalContentWidth = cardAndGapWidth * numberOfOriginalCards;


        function scrollTestimonials() {
            scrollPosition += scrollSpeed;

            // If the scroll position has moved past the original content width
            if (scrollPosition >= originalContentWidth) {
                // Instantly jump back to the start of the duplicated content
                // This position is equivalent to scrollLeft = 0 of the entire container
                scrollPosition = 0;
            }

            testimonialsContainer.scrollLeft = scrollPosition;

            // Continue the animation loop
            requestAnimationFrame(scrollTestimonials);
        }

        // Start scrolling animation after a small delay to ensure elements are rendered and widths are calculated correctly
        setTimeout(scrollTestimonials, 100); // 100ms delay
    }
});

// Remove previous particle background script
// Remove previous parallax effect script
// Remove previous glitch text effect script

// Navbar Scroll Effect (Simplified)
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) { // Add 'scrolled' class as soon as user scrolls
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// GSAP Animations (Simplified and adapted)
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin); // Ensure ScrollToPlugin is registered

// Hero Section Animation (Adapted)
gsap.from('.hero-title', {
    duration: 1.2,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.6
});

gsap.from('.hero-subtitle', {
    duration: 1.2,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.8
});

gsap.from('.hero-promo', {
    duration: 1.2,
    y: 30,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.4
});

// Sections Animation (Applied to all sections)
// Already handled in DOMContentLoaded
