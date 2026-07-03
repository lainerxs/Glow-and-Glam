/* ==================== SHOW MENU ==================== */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

/* Show menu */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

/* Hide menu */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/* Hide menu on link click (mobile) */
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

/* ==================== ACTIVE LINK ON SCROLL ==================== */
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        
        const navLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active-link');
            } else {
                navLink.classList.remove('active-link');
            }
        }
    });
}

window.addEventListener('scroll', scrollActive);

/* ==================== SCROLL UP BUTTON ==================== */
const scrollUp = document.getElementById('scroll-up');

function showScrollUp() {
    if (window.scrollY >= 350) {
        scrollUp.classList.add('show-scroll');
    } else {
        scrollUp.classList.remove('show-scroll');
    }
}

window.addEventListener('scroll', showScrollUp);

/* ==================== ANIMATED COUNTERS (About Section) ==================== */
const statNumbers = document.querySelectorAll('.about__stat-number');

function animateCounters() {
    statNumbers.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = easeOutQuart * target;
            
            if (isDecimal) {
                stat.textContent = currentValue.toFixed(1);
            } else {
                stat.textContent = Math.floor(currentValue);
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                if (isDecimal) {
                    stat.textContent = target.toFixed(1);
                } else {
                    stat.textContent = target;
                }
            }
        };
        
        requestAnimationFrame(updateCounter);
    });
}

/* ==================== INTERSECTION OBSERVER FOR COUNTERS ==================== */
const aboutSection = document.querySelector('.about');

if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(aboutSection);
}

/* ==================== GALLERY FILTER ==================== */
const filterButtons = document.querySelectorAll('.gallery__filter');
const galleryItems = document.querySelectorAll('.gallery__item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active-filter'));
        button.classList.add('active-filter');
        
        const filterValue = button.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                // Add a small animation
                item.style.animation = 'fadeIn 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Add keyframes for filter animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(styleSheet);

/* ==================== GALLERY LIGHTBOX (Click to enlarge) ==================== */
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img) return;
        
        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            cursor: pointer;
            padding: 2rem;
        `;
        
        const imgClone = img.cloneNode();
        imgClone.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;
        
        lightbox.appendChild(imgClone);
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Close on click
        lightbox.addEventListener('click', () => {
            lightbox.remove();
            document.body.style.overflow = '';
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                if (document.body.contains(lightbox)) {
                    lightbox.remove();
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', closeOnEscape);
                }
            }
        });
    });
});

/* ==================== CONTACT FORM HANDLING ==================== */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const inputs = this.querySelectorAll('input, textarea, select');
        let formData = {};
        
        inputs.forEach(input => {
            if (input.type !== 'submit') {
                formData[input.placeholder || input.name || 'field'] = input.value;
            }
        });
        
        // Simple validation
        const name = inputs[0].value.trim();
        const email = inputs[1].value.trim();
        const phone = inputs[2].value.trim();
        const service = inputs[3].value;
        
        if (!name || !email || !phone || !service) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Show success message
        alert('Thank you for your booking request! We will contact you within 24 hours.');
        this.reset();
    });
}

/* ==================== SMOOTH SCROLL FOR NAV LINKS ==================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ==================== HEADER SHADOW ON SCROLL ==================== */
const header = document.querySelector('.header');

function headerShadow() {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 10px rgba(0, 0, 0, 0.05)';
    }
}

window.addEventListener('scroll', headerShadow);

console.log('✨ Glow & Glam - Where beauty meets art! ✨');