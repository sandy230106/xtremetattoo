document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Ink Loader
       ========================================================================== */
    const loader = document.getElementById('loader');
    
    // Ensure loader shows for at least 2.5 seconds to complete ink animation
    const minLoaderTime = 2500;
    const startTime = Date.now();
    
    window.addEventListener('load', () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const timeRemaining = minLoaderTime - elapsedTime;
        
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
            
            // Trigger reveals for elements already in viewport on load
            triggerReveals();
        }, Math.max(0, timeRemaining));
    });

    /* ==========================================================================
       Custom Cursor
       ========================================================================== */
    const cursor = document.querySelector('.cursor');
    const hoverTargets = document.querySelectorAll('a, button, .service-card, .portfolio-item, input, select, textarea');

    // Only enable custom cursor if not on a touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
            });
            target.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
            });
        });
    }

    /* ==========================================================================
       Navbar Scroll Effect
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* ==========================================================================
       Scroll Reveal Animations
       ========================================================================== */
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    function triggerReveals() {
        if(document.body.classList.contains('loading')) return; // Don't trigger while loading
        
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', triggerReveals);

    /* ==========================================================================
       Portfolio Filtering
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    // Re-trigger reveal for filtered items
                    setTimeout(() => item.classList.add('active'), 50);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('active');
                }
            });
        });
    });

    /* ==========================================================================
       Form Submission
       ========================================================================== */
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple visual feedback
            const btn = bookingForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'Request Sent!';
            btn.style.backgroundColor = 'var(--clr-gold)';
            btn.style.borderColor = 'var(--clr-gold)';
            btn.style.color = 'var(--clr-black)';
            
            setTimeout(() => {
                bookingForm.reset();
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 3000);
        });
    }
});
