// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const backToTopButton = document.getElementById('backToTop');
const loader = document.getElementById('loader');
const content = document.getElementById('content');
const navLinks = document.getElementById('navLinks');
const hamburger = document.querySelector('.hamburger');

// Dark Mode Toggle
darkModeToggle.addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', this.checked);

    // Animate dark mode transition
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

// Mobile Menu Toggle
function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// Back to Top Button Visibility
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) { // Show button after scrolling 300px
    backToTopButton.classList.add('show');
  } else {
    backToTopButton.classList.remove('show');
  }
});

// Scroll to Top Functionality
backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Smooth scrolling
  });
});

// Page Loader
window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');

    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            content.style.display = 'block';
            animateOnScroll(); // Initialize scroll animations after page loads
        }, 500); // Delay to allow fade-out animation
    }, 1000); // Loader duration
});

// Scroll Animations
function animateOnScroll() {
    const animateElements = document.querySelectorAll('.service-card, .project-card, .skills-section, .about-me-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = '1rem 2rem';
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.padding = '1.5rem 2rem';
        header.style.boxShadow = 'none';
    }
});

// Refresh or reinitialize on device resize
window.addEventListener('resize', () => {
    // Optional: Refresh the page on resize
    location.reload();

    // Optional: Reinitialize animations or layout adjustments
    // Example: Recalculate header padding or menu state
    const header = document.querySelector('header');
    if (window.innerWidth > 768) {
        header.style.padding = '1.5rem 2rem';
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    } else {
        header.style.padding = '1rem 2rem';
    }
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add any initial animations here
});

// Smooth scroll to projects section
document.querySelector('.cta-button').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#projects').scrollIntoView({
        behavior: 'smooth'
    });
});

