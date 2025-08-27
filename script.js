// ===== GLOBAL VARIABLES =====
let currentTestimonial = 0;
let testimonialInterval;
const testimonials = document.querySelectorAll('.testimonial-card');

// ===== LOADING SCREEN =====
window.addEventListener('load', function() {
  const loader = document.querySelector('.loading-screen');
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(function() {
      loader.style.display = 'none';
      document.body.style.overflow = 'visible';
    }, 500);
  }
});

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  
  if (!cursorDot || !cursorOutline) return;
  
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });
  
  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.2;
    outlineY += (mouseY - outlineY) * 0.2;
    
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    
    requestAnimationFrame(animateOutline);
  }
  
  animateOutline();
  
  // Cursor interactions
  const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill, .social-link');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.style.transform = 'scale(1.5)';
      cursorOutline.style.opacity = '0.8';
    });
    
    el.addEventListener('mouseleave', () => {
      cursorOutline.style.transform = 'scale(1)';
      cursorOutline.style.opacity = '0.5';
    });
  });
}

// ===== NAVIGATION =====
function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navProgress = document.getElementById('nav-progress');
  
  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', 
        hamburger.classList.contains('active') ? 'true' : 'false'
      );
    });
    
    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  // Active nav highlighting and progress bar
  const sections = document.querySelectorAll('section[id]');
  const navLinksArray = document.querySelectorAll('.nav-links a[href^="#"]');
  
  function updateActiveNav() {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Update progress bar
    const progress = (scrollY / (documentHeight - windowHeight)) * 100;
    if (navProgress) {
      navProgress.style.width = Math.min(progress, 100) + '%';
    }
    
    // Update active section
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinksArray.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Get saved theme or default to system preference
  let currentTheme = localStorage.getItem('theme') || 
    (prefersDark.matches ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeToggleIcon(currentTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
      updateThemeToggleIcon(currentTheme);
    });
  }
  
  function updateThemeToggleIcon(theme) {
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
  
  // Listen for system theme changes
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      currentTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      updateThemeToggleIcon(currentTheme);
    }
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);
  
  // Observe all elements with reveal class
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}

// ===== COUNTER ANIMATION =====
function initCounterAnimation() {
  const counters = document.querySelectorAll('.num[data-target]');
  
  const observerOptions = {
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
  
  function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  }
}

// ===== SKILL BARS ANIMATION =====
function initSkillBars() {
  const skillBars = document.querySelectorAll('.bar span');
  
  const observerOptions = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const percent = bar.style.getPropertyValue('--pct');
        bar.style.width = percent;
        observer.unobserve(entry.target.parentElement);
      }
    });
  }, observerOptions);
  
  skillBars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar.parentElement);
  });
}

// ===== PROJECT FILTERING =====
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filters .chip');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter projects
      projectCards.forEach(card => {
        const tags = card.getAttribute('data-tags');
        if (filter === 'all' || (tags && tags.includes(filter))) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ===== TESTIMONIALS SLIDER =====
function initTestimonialsSlider() {
  const slider = document.getElementById('testimonials-slider');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const dotsContainer = document.getElementById('testimonial-dots');
  
  if (!testimonials.length) return;
  
  // Create dots
  testimonials.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'slider-dot';
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToTestimonial(index));
    dotsContainer.appendChild(dot);
  });
  
  const dots = document.querySelectorAll('.slider-dot');
  
  // Hide all testimonials except first
  testimonials.forEach((testimonial, index) => {
    if (index !== 0) {
      testimonial.style.display = 'none';
    }
  });
  
  function goToTestimonial(index) {
    if (index === currentTestimonial) return;
    
    // Fade out current
    testimonials[currentTestimonial].style.opacity = '0';
    setTimeout(() => {
      testimonials[currentTestimonial].style.display = 'none';
      
      // Show new testimonial
      testimonials[index].style.display = 'block';
      setTimeout(() => {
        testimonials[index].style.opacity = '1';
      }, 50);
      
      // Update active states
      dots[currentTestimonial].classList.remove('active');
      dots[index].classList.add('active');
      
      currentTestimonial = index;
    }, 300);
  }
  
  function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonials.length;
    goToTestimonial(next);
  }
  
  function prevTestimonial() {
    const prev = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    goToTestimonial(prev);
  }
  
  // Event listeners
  if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
  if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
  
  // Auto-slide
  function startAutoSlide() {
    testimonialInterval = setInterval(nextTestimonial, 5000);
  }
  
  function stopAutoSlide() {
    clearInterval(testimonialInterval);
  }
  
  startAutoSlide();
  
  // Pause on hover
  if (slider) {
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
  }
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = form.querySelector('.submit-btn');
  const formStatus = document.getElementById('form-status');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm(form)) return;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    formStatus.style.display = 'none';
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      showFormStatus('Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.', 'success');
      form.reset();
      
    } catch (error) {
      showFormStatus('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
  
  function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      const fieldContainer = field.closest('.form-field');
      const errorElement = fieldContainer.querySelector('.error');
      
      // Reset previous errors
      fieldContainer.classList.remove('invalid');
      
      if (!field.value.trim()) {
        showFieldError(fieldContainer, errorElement, 'This field is required');
        isValid = false;
      } else if (field.type === 'email' && !isValidEmail(field.value)) {
        showFieldError(fieldContainer, errorElement, 'Please enter a valid email address');
        isValid = false;
      } else if (field.name === 'name' && field.value.trim().length < 2) {
        showFieldError(fieldContainer, errorElement, 'Name must be at least 2 characters');
        isValid = false;
      } else if (field.name === 'message' && field.value.trim().length < 10) {
        showFieldError(fieldContainer, errorElement, 'Message must be at least 10 characters');
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  function showFieldError(fieldContainer, errorElement, message) {
    fieldContainer.classList.add('invalid');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }
  
  function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 5000);
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Real-time validation
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.hasAttribute('required')) {
        validateForm(form);
      }
    });
    
    input.addEventListener('input', () => {
      const fieldContainer = input.closest('.form-field');
      if (fieldContainer.classList.contains('invalid')) {
        fieldContainer.classList.remove('invalid');
      }
    });
  });
}

// ===== NEWSLETTER FORM =====
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = form.querySelector('input[type="email"]').value;
    const submitBtn = form.querySelector('button');
    const originalText = submitBtn.textContent;
    
    if (!email || !isValidEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Show loading state
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    try {
      // Simulate subscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success
      submitBtn.textContent = 'Subscribed!';
      submitBtn.style.background = '#10b981';
      form.querySelector('input').value = '';
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 2000);
      
    } catch (error) {
      submitBtn.textContent = 'Try Again';
      submitBtn.disabled = false;
    }
  });
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== TYPING ANIMATION =====
function initTypingAnimation() {
  const typingElements = document.querySelectorAll('.typing-text');
  
  typingElements.forEach(element => {
    const originalText = element.textContent;
    element.textContent = '';
    
    let i = 0;
    const typeTimer = setInterval(() => {
      if (i < originalText.length) {
        element.textContent += originalText.charAt(i);
        i++;
      } else {
        clearInterval(typeTimer);
      }
    }, 100);
  });
}

// ===== FOOTER YEAR =====
function updateFooterYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initPerformanceOptimizations() {
  // Lazy load images
  const images = document.querySelectorAll('img[src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => {
    imageObserver.observe(img);
  });
  
  // Preload critical resources
  const preloadLinks = [
    { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap', as: 'style' }
  ];
  
  preloadLinks.forEach(({ href, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initAccessibilityFeatures() {
  // Skip to content link
  const skipLink = document.createElement('a');
  skipLink.href = '#hero';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -100px;
    left: 10px;
    background: var(--primary);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 9999;
    transition: top 0.3s;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '10px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-100px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Keyboard navigation for custom elements
  const interactiveElements = document.querySelectorAll('.chip, .slider-dot, .project-card');
  
  interactiveElements.forEach(element => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
    
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
  });
  
  // ARIA live region for dynamic content updates
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;
  document.body.appendChild(liveRegion);
  
  // Announce page changes
  window.addEventListener('popstate', () => {
    liveRegion.textContent = 'Page content updated';
  });
}

// ===== ERROR HANDLING =====
function initErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Optionally send to analytics or error tracking service
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault(); // Prevent default browser error handling
  });
}

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all features
  initCustomCursor();
  initNavigation();
  initThemeToggle();
  initScrollAnimations();
  initCounterAnimation();
  initSkillBars();
  initProjectFiltering();
  initTestimonialsSlider();
  initContactForm();
  initNewsletterForm();
  initSmoothScrolling();
  initTypingAnimation();
  initPerformanceOptimizations();
  initAccessibilityFeatures();
  initErrorHandling();
  updateFooterYear();
  
  // Show body after initialization
  document.body.style.visibility = 'visible';
});

// ===== WINDOW RESIZE HANDLER =====
window.addEventListener('resize', debounce(() => {
  // Recalculate positions for fixed elements
  const header = document.querySelector('.header');
  if (header) {
    document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
  }
}, 250));

// ===== UTILITY FUNCTIONS =====
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

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===== EXPORT FOR MODULE USE =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initCustomCursor,
    initNavigation,
    initThemeToggle,
    initContactForm,
    initNewsletterForm
  };
}