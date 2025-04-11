// DOM Elements
const header = document.getElementById('header');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const themeToggle = document.createElement('div');
const sections = document.querySelectorAll('.section');
const scrollTopBtn = document.createElement('div');
const loader = document.createElement('div');

// Create and append loader
loader.className = 'loader';
loader.innerHTML = `
    <div class="loader-content">
        <div class="loader-circle"></div>
        <h3>Loading...</h3>
    </div>
`;
document.body.appendChild(loader);

// Hide loader on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            // Start section animations after page is loaded
            animateOnScroll();
            // Start typing effect
            typingEffect();
        }, 500);
    }, 1000);
    
    // Initialize EmailJS
    emailjs.init("bjMBMgTzIUvcHfegm"); // Replace with your actual EmailJS user ID
});

// Create and append theme toggle button
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
document.body.appendChild(themeToggle);

// Create and append scroll to top button
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

// Check for saved theme preference or use default
const getCurrentTheme = () => {
    return localStorage.getItem('theme') || 'light';
};

// Apply theme
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
    if (theme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
};

// Initialize theme
applyTheme(getCurrentTheme());

// Theme toggle event
themeToggle.addEventListener('click', () => {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
});

// Scroll Effect for Header
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// Scroll to top functionality
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active link highlight based on scroll position
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav-link[href*=' + sectionId + ']').classList.add('active');
        } else {
            document.querySelector('.nav-link[href*=' + sectionId + ']').classList.remove('active');
        }
    });
});

// Form submission handling with EmailJS
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Basic form validation
    if (!name || !email || !subject || !message) {
        showFormMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';
    
    // Send email using EmailJS
    emailjs.send(
        'service_qppb85h',  // Replace with your actual EmailJS service ID
        'template_gjuwevh', // Replace with your actual EmailJS template ID
        {
            from_name: name,
            reply_to: email,
            to_name: 'Collins Otieno',
            subject: subject,
            message: message
        }
    ).then(() => {
        // Success
        showFormMessage(`Thank you for your message, ${name}! I'll respond as soon as possible.`, 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }).catch((error) => {
        // Error
        showFormMessage('Failed to send message. Please try again later.', 'error');
        console.error('EmailJS error:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    });
});

// Function to show form message
function showFormMessage(text, type) {
    const formMessage = document.querySelector('.form-message') || document.createElement('div');
    formMessage.className = `form-message ${type}`;
    formMessage.textContent = text;
    formMessage.style.display = 'block';
    
    if (!formMessage.parentElement) {
        contactForm.appendChild(formMessage);
    }
    
    // Auto hide the message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Add animation on scroll
const animateOnScroll = () => {
    sections.forEach(section => {
        const elementPosition = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            section.classList.add('animated');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);

// Typing effect for hero section
const typingEffect = () => {
    const text = "Software Engineering Student";
    const typingElement = document.querySelector('.hero-content h2');
    let i = 0;
    
    if (typingElement) {
        typingElement.innerHTML = "";
        
        const typing = setInterval(() => {
            if (i < text.length) {
                typingElement.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
                
                // After typing completes, add a blinking cursor effect
                setTimeout(() => {
                    typingElement.innerHTML = text + '<span class="cursor">|</span>';
                    setInterval(() => {
                        const cursor = document.querySelector('.cursor');
                        if (cursor) {
                            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
                        }
                    }, 500);
                }, 500);
            }
        }, 100);
    }
};

// Add CSS for cursor blinking
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .cursor {
        display: inline-block;
        width: 2px;
        height: 1em;
        background-color: var(--primary-color);
        animation: blink 1s infinite;
        margin-left: 5px;
    }
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;
document.head.appendChild(cursorStyle);

// Add skill progress animation
const animateSkills = () => {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
};

// Initialize skill animations when skills section comes into view
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    skillsObserver.observe(skillsSection);
}

// Preload project card hover effect to avoid jank on first hover
const preloadHoverEffects = () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.classList.add('hover-preload');
        setTimeout(() => {
            card.classList.remove('hover-preload');
        }, 50);
    });
};

// Call preload function after page is fully loaded
window.addEventListener('load', () => {
    setTimeout(preloadHoverEffects, 2000);
});

// Add download resume button functionality if needed
const resumeBtn = document.querySelector('.btn[href*="resume"]');
if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
        // If you have a real resume file, you would keep the default behavior
        // For demo purposes without a real file, prevent default and show message
        if (!resumeBtn.getAttribute('href').endsWith('.pdf')) {
            e.preventDefault();
            alert('Resume download feature will be available soon!');
        }
    });
}