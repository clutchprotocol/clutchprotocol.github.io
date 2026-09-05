// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        // Animate hamburger menu
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (isOpen) {
                if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bar.style.transform = '';
                bar.style.opacity = '';
            }
        });
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const wasOpen = navMenu.classList.contains('active');
            navMenu.classList.remove('active');
            if (wasOpen) {
                navToggle.setAttribute('aria-expanded', 'false');
            }
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = '';
                bar.style.opacity = '';
            });
        });
    });

    // Smooth scrolling is handled by CSS scroll-behavior: smooth
    // and scroll-margin-top on section targets; no JS override needed.

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation (skip when reduced motion is preferred)
    const animateElements = document.querySelectorAll('.feature-card, .team-member, .community-card, .arch-component, .try-stage-card, .try-stage-links');
    if (!prefersReducedMotion) {
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Counter animation for stats
    // Counts to `target`, then writes `finalText` — the original string, suffix and all.
    //
    // Driven by elapsed time rather than a fixed per-frame increment. The old version added
    // target/125 on every frame and assumed 60fps, so anywhere frames come slower — a background
    // tab, a throttled or busy device — it was still counting long after it should have finished.
    // A caller's separate 2s timer then restored the real number and the still-running loop
    // overwrote it with whatever it had reached. The hero stat could sit on "1" forever.
    function animateCounter(element, target, finalText, duration = 2000) {
        const startedAt = performance.now();
        let settled = false;

        // Whoever gets here first wins, and the other path then does nothing. That flag is the
        // actual fix: the old code had a timer restoring the real number in parallel with a
        // running animation, so on slow frames the animation overwrote it and the stat sat on a
        // half-counted value.
        function settle() {
            if (settled) return;
            settled = true;
            element.textContent = finalText;
        }

        function updateCounter(now) {
            if (settled) return;
            const progress = Math.min((now - startedAt) / duration, 1);
            if (progress < 1) {
                element.textContent = Math.floor(target * progress);
                requestAnimationFrame(updateCounter);
            } else {
                settle();
            }
        }

        requestAnimationFrame(updateCounter);
        // Safety net, not a second animator. requestAnimationFrame does not run in a hidden tab
        // while IntersectionObserver still can, so the animation may never start at all — and
        // without this the stat would be stuck showing the "0" placeholder rather than its value.
        setTimeout(settle, duration + 100);
    }

    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                const text = statNumber.textContent;
                
                // Extract number from text like "60%" or "$100B+"
                const number = parseInt(text.replace(/[^\d]/g, ''));
                if (!isNaN(number) && number > 0) {
                    statNumber.textContent = '0' + text.replace(/\d+/, '');
                    // The original text goes in as an argument. It used to be restored by a
                    // parallel setTimeout, which raced the animation and lost on slow frames.
                    animateCounter(statNumber, number, text);
                }
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Blockchain animation enhancement
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((block, index) => {
        block.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) translateY(-5px)';
            this.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
        });
        
        block.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
        });
    });


    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
            // Easter egg activated
            document.body.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 3000);
            konamiCode = [];
        }
    });

    // External links open in a new tab via target="_blank"; no destructive
    // innerHTML spinner (it broke icon markup and flashed "Opening…").

    // Add subtle parallax effect to hero section (skip when reduced motion is preferred)
    if (!prefersReducedMotion) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroVisual = document.querySelector('.hero-visual');
            if (heroVisual && scrolled < window.innerHeight) {
                heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    console.log('Clutch Protocol website loaded.');
});








