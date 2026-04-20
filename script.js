/* ===================================
   Wuthering Waves Portfolio - Scripts
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initParticles();
    initCursorGlow();
    initNavigation();
    initScrollAnimations();
    initCounterAnimation();
    initSmoothScroll();
    initActiveNavHighlight();
});

/* ===================================
   Particle System
   =================================== */
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 10;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
    `;
    
    container.appendChild(particle);
}

/* ===================================
   Cursor Glow Effect
   =================================== */
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');
    if (!cursorGlow) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        cursorGlow.style.display = 'none';
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth follow animation
    function animateCursor() {
        const ease = 0.1;
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;
        
        cursorGlow.style.left = `${currentX}px`;
        cursorGlow.style.top = `${currentY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Hide cursor glow on touch devices
    if ('ontouchstart' in window) {
        cursorGlow.style.display = 'none';
    }
}

/* ===================================
   Navigation
   =================================== */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const header = document.querySelector('.header');
    
    if (!navToggle || !navLinks) return;

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Header scroll effect
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for background
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            navToggle.focus();
        }
    });
}

/* ===================================
   Scroll Animations (Intersection Observer)
   =================================== */
function initScrollAnimations() {
    // Elements to animate
    const animatedElements = document.querySelectorAll(
        '.skill-card, .project-card, .timeline-item, .about-content, .section-header'
    );

    if (!animatedElements.length) return;

    // Add initial class
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });

    // Intersection Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/* ===================================
   Counter Animation
   =================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observerOptions = {
        root: null,
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        element.textContent = target + '+';
        return;
    }

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * easeOutCubic);
        
        element.textContent = current + '+';
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

/* ===================================
   Smooth Scroll
   =================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update URL without jumping
            history.pushState(null, null, href);
            
            // Set focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });
}

/* ===================================
   Active Navigation Highlight
   =================================== */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

/* ===================================
   Utility Functions
   =================================== */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ===================================
   Keyboard Navigation Enhancement
   =================================== */
document.addEventListener('keydown', (e) => {
    // Tab trap for mobile menu
    const navLinks = document.getElementById('navLinks');
    if (navLinks && navLinks.classList.contains('active')) {
        const focusableElements = navLinks.querySelectorAll('a[href]');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

/* ===================================
   Error Handling for Images
   =================================== */
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Image failed to load:', this.src);
    });
});

/* ===================================
   Performance: Lazy Loading
   =================================== */
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

/* ===================================
   Console Easter Egg
   =================================== */
console.log(
    '%c Welcome, Rover! ',
    'background: linear-gradient(135deg, #00e5cc, #00b3a0); color: #0a0f1a; font-size: 16px; font-weight: bold; padding: 10px 20px; border-radius: 4px;'
);
console.log(
    '%c May the echoes guide your path... ',
    'color: #00e5cc; font-size: 12px; font-style: italic;'
);
