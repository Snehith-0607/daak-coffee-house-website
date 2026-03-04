document.addEventListener('DOMContentLoaded', () => {
    /* --- Navbar Scroll Effect & Progress Bar --- */
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        // Sticky Navbar Style Toggle
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Indicator
        if (scrollProgress) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            // Cap at 100 to prevent overflow if bouncing
            scrollProgress.style.width = Math.min(scrollPercent, 100) + '%';
        }
    });

    /* --- Mobile Menu Toggle --- */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navContainer = document.querySelector('.nav-container');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        navContainer.classList.toggle('mobile-active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navContainer.classList.remove('mobile-active');
        });
    });

    /* --- Dynamic Scroll Reveal Animations --- */
    // Smoothly fade and slide up entire sections, but skip sections where we want
    // child elements (like grids) to stagger in individually.
    document.querySelectorAll('section:not(.hero):not(#signature):not(#gallery):not(#menu):not(#experience):not(#quick-info) > .container').forEach(el => {
        el.classList.add('reveal', 'reveal-slide-up');
    });

    // Manually reveal the headers for the staggered sections
    document.querySelectorAll('#gallery .menu-header, #menu .menu-header, #experience .menu-header').forEach(el => {
        el.classList.add('reveal', 'reveal-slide-up');
    });

    // Signature Drink Section specific staggered reveals
    const sigImage = document.querySelector('.signature-image-wrapper');
    if (sigImage) sigImage.classList.add('reveal', 'reveal-fade');

    document.querySelectorAll('.signature-label, .signature-title, .signature-desc, .signature-btn').forEach(el => {
        el.classList.add('reveal', 'reveal-slide-up');
    });

    // Keep staggering for grid items within those sections
    document.querySelectorAll('.menu-card, .gallery-item').forEach(el => {
        el.classList.add('reveal', 'reveal-slide-up');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve so animation only triggers once for premium feel
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(element => {
        revealObserver.observe(element);
    });

    /* --- Cinematic Premium Parallax Effect for Hero --- */
    const heroSection = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');
    const heroCard = document.querySelector('.hero-card');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (heroSection && window.scrollY <= heroSection.offsetHeight) {
                    const scrollPos = window.scrollY;

                    // 1. Background image scales down slightly and moves slower (cinematic depth)
                    const scaleValue = Math.max(1.0, 1.05 - (scrollPos * 0.0001));
                    const yPos = scrollPos * 0.4;
                    if (heroBg) {
                        heroBg.style.transform = `translateY(${yPos}px) scale(${scaleValue})`;
                    }

                    // 2. Headline card fades upward as user scrolls away
                    const opacityValue = Math.max(0, 1 - (scrollPos / 400));
                    const cardY = -(scrollPos * 0.15); // Negative translation pushes it up faster
                    if (heroCard) {
                        heroCard.style.opacity = opacityValue;
                        heroCard.style.transform = `translateY(${cardY}px)`;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    /* --- Custom Smooth Scrolling with Easing --- */
    // Easing function (easeInOutCubic)
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const smoothScroll = (target, duration = 800) => {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        // Calculate offset (adjust for sticky navbar if needed)
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;

            // Calculate progress between 0 and 1
            const progress = Math.min(timeElapsed / duration, 1);

            // Apply easing
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    // Attach to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = this.getAttribute('href');

            // Only hijacking if it's an actual anchor, not just "#"
            if (target !== "#" && target !== "") {
                e.preventDefault();
                smoothScroll(target, 1000); // 1000ms duration for premium feel
            }
        });
    });
});
