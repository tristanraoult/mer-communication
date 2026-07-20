document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initCustomCursor();
  initMenu();
  initScrollEffects();
  initIntersectionObserver();
  initSplitText();
  initStatsCounter();
  initRdvForm();
  initPageTransitions();
  initProjectFilters();
});

/* ==========================================================================
   1. Custom Cursor with Inertia
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('custom-cursor-dot');
  const circle = document.getElementById('custom-cursor-circle');
  if (!dot || !circle) return;

  let mouseX = 0, mouseY = 0; // Current mouse coords
  let circleX = 0, circleY = 0; // Current circle coords (with lag)
  const speed = 0.15; // Inertia coefficient (lower is slower/smoother)

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot instantly
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Animation loop for circle inertia
  function animateCircle() {
    // Lerp (Linear Interpolation) formula: Current = Current + (Target - Current) * Speed
    circleX += (mouseX - circleX) * speed;
    circleY += (mouseY - circleY) * speed;

    circle.style.left = `${circleX}px`;
    circle.style.top = `${circleY}px`;

    requestAnimationFrame(animateCircle);
  }
  animateCircle();

  // Hover states
  const interactives = document.querySelectorAll('a, button, select, input, textarea, .slot-label, .filter-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // Project card hover
  const projects = document.querySelectorAll('.project-card');
  projects.forEach(p => {
    p.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-view-project');
    });
    p.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-view-project');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    circle.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    circle.style.opacity = '1';
  });
}

/* ==========================================================================
   2. Fullscreen Menu with Letter/Link Animations
   ========================================================================== */
function initMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const menuOverlay = document.getElementById('menu-overlay');
  if (!menuBtn || !menuOverlay) return;

  // Split links text into spans to animate each character on menu open
  const menuLinks = document.querySelectorAll('.menu-links a');
  menuLinks.forEach((link, linkIndex) => {
    const text = link.textContent.trim();
    link.textContent = ''; // clear original text
    
    // Wrap each letter in a span
    [...text].forEach((char, charIndex) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // preserve spaces
      span.style.display = 'inline-block';
      span.style.transform = 'translateY(100%)';
      span.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      // Stagger letters + stagger links
      span.style.transitionDelay = `${(linkIndex * 0.1) + (charIndex * 0.02)}s`;
      link.appendChild(span);
    });
  });

  menuBtn.addEventListener('click', () => {
    const isActive = document.body.classList.toggle('menu-active');
    menuOverlay.classList.toggle('active', isActive);

    // Animate letters inside links
    const spans = menuOverlay.querySelectorAll('.menu-links a span');
    spans.forEach(span => {
      if (isActive) {
        span.style.transform = 'translateY(0)';
      } else {
        // Reset transform instantly when closing to be ready for next open
        span.style.transitionDelay = '0s';
        span.style.transform = 'translateY(100%)';
        // restore delays after a short timeout
        setTimeout(() => {
          const charIndex = Array.from(span.parentNode.children).indexOf(span);
          const linkIndex = Array.from(span.parentNode.parentNode.parentNode.children).indexOf(span.parentNode.parentNode);
          span.style.transitionDelay = `${(linkIndex * 0.1) + (charIndex * 0.02)}s`;
        }, 100);
      }
    });
  });
}

/* ==========================================================================
   3. Scroll Progress & Header scrolled state
   ========================================================================== */
function initScrollEffects() {
  const header = document.getElementById('site-header');
  const progressBar = document.getElementById('scroll-progress');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Scrolled header state
    if (header) {
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll progress bar width
    if (progressBar && docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }
  });
}

/* ==========================================================================
   4. Intersection Observer for Scroll Reveals
   ========================================================================== */
function initIntersectionObserver() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. Hero Title Split Text (Word Reveal)
   ========================================================================== */
function initSplitText() {
  const animatedHeadings = document.querySelectorAll('.animate-split');
  
  animatedHeadings.forEach(heading => {
    const text = heading.textContent.trim();
    const words = text.split(' ');
    heading.textContent = ''; // clear

    words.forEach((word, wordIndex) => {
      const outerSpan = document.createElement('span');
      outerSpan.style.display = 'inline-block';
      outerSpan.style.overflow = 'hidden';
      outerSpan.style.marginRight = '0.25em';
      
      const innerSpan = document.createElement('span');
      innerSpan.textContent = word;
      innerSpan.style.display = 'inline-block';
      innerSpan.style.transform = 'translateY(110%)';
      innerSpan.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      innerSpan.style.transitionDelay = `${wordIndex * 0.1}s`;
      
      outerSpan.appendChild(innerSpan);
      heading.appendChild(outerSpan);

      // Trigger animation on next frame
      requestAnimationFrame(() => {
        innerSpan.style.transform = 'translateY(0)';
      });
    });
  });
}

/* ==========================================================================
   6. Statistics Count Up Animation
   ========================================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;

  const countUp = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const duration = 2000; // ms
    const startTime = performance.now();
    const isFloat = el.getAttribute('data-float') === 'true';

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad function
      const easeProgress = progress * (2 - progress);
      const currentValue = easeProgress * target;

      if (isFloat) {
        el.textContent = currentValue.toFixed(1);
      } else {
        el.textContent = Math.floor(currentValue);
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target; // Ensure exact final value
      }
    }
    requestAnimationFrame(updateCount);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   7. Appointment (Rendez-vous) Form Processing
   ========================================================================== */
function initRdvForm() {
  const form = document.getElementById('rdv-form');
  const successMsg = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Button click animation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Envoi en cours... <span class="accent-dot">.</span>';
    submitBtn.style.transform = 'scale(0.95)';

    // Simulate server submission
    setTimeout(() => {
      // Hide form contents with height transition
      form.style.display = 'none';
      
      // Show success container with animation
      if (successMsg) {
        successMsg.classList.add('active');
        
        // Scroll into view gently
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1500);
  });
}

/* ==========================================================================
   8. Smooth Page Transitions
   ========================================================================== */
function initPageTransitions() {
  const transitionLayer = document.getElementById('transition-layer');
  if (!transitionLayer) return;

  // Make sure it is visible on load
  transitionLayer.style.display = 'block';
  transitionLayer.classList.remove('animate-in');
  transitionLayer.style.transform = 'translateY(0)';
  
  setTimeout(() => {
    transitionLayer.style.transition = 'transform 0.8s cubic-bezier(0.85, 0, 0.15, 1)';
    transitionLayer.style.transform = 'translateY(-100%)';
    
    // Hide completely after transition finishes to prevent layout/screenshot glitches
    setTimeout(() => {
      transitionLayer.style.display = 'none';
    }, 800);
  }, 50);

  // Hijack internal page links
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    const targetUrl = link.getAttribute('href');
    if (!targetUrl) return;

    // Skip mailto, tel, anchors, external links, and blank targets
    if (
      targetUrl.startsWith('mailto:') ||
      targetUrl.startsWith('tel:') ||
      targetUrl.startsWith('#') ||
      targetUrl.startsWith('http://') ||
      targetUrl.startsWith('https://') ||
      link.getAttribute('target') === '_blank'
    ) {
      return;
    }

    link.addEventListener('click', (e) => {
      // Don't transition if it is an anchor on the same page
      if (targetUrl.includes('#') && targetUrl.split('#')[0] === window.location.pathname) {
        return;
      }
      
      e.preventDefault();
      
      // Close menu if open
      document.body.classList.remove('menu-active');
      const menuOverlay = document.getElementById('menu-overlay');
      if (menuOverlay) menuOverlay.classList.remove('active');
      
      // Show transition layer again before animating it
      transitionLayer.style.display = 'block';
      transitionLayer.style.transition = 'none';
      transitionLayer.style.transform = 'translateY(100%)';
      
      requestAnimationFrame(() => {
        transitionLayer.style.transition = 'transform 0.6s cubic-bezier(0.85, 0, 0.15, 1)';
        transitionLayer.style.transform = 'translateY(0)';
      });
      
      // Navigate after transition completes
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 600);
    });
  });
}

/* ==========================================================================
   9. Portfolio Projects Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-categories').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'block';
          // Trigger entry animation again
          card.classList.remove('visible');
          setTimeout(() => {
            card.classList.add('visible');
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
