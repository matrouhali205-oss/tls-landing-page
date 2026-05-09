// ================================================
// THE LAYER STUDIO — Landing Page Animations
// GSAP ScrollTrigger + Video Background Hero
// ================================================

gsap.registerPlugin(ScrollTrigger);


// ====== NAVBAR ======
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});


// ====== HERO CONTENT ENTRANCE ======
const heroTl = gsap.timeline({ delay: 0.4 });
heroTl
  .from('.hero-badge', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
  .from('.hero h1', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
  .from('.hero .subtitle', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
  .from('.hero-buttons', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
  .from('.scroll-indicator', { opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.3');


// ====== HERO SCROLL PARALLAX (content fades, video stays) ======
gsap.to('.hero-content', {
  y: -80, opacity: 0, ease: 'none',
  scrollTrigger: {
    trigger: '.hero', start: '20% top', end: 'bottom top',
    scrub: 1,
  }
});

gsap.to('.scroll-indicator', {
  opacity: 0, ease: 'none',
  scrollTrigger: {
    trigger: '.hero', start: '10% top', end: '30% top',
    scrub: true,
  }
});


// ====== STATS COUNTER ======
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const suffix = (el.dataset.count === '98' || el.dataset.count === '85') ? '%' : '+';
      el.textContent = Math.floor(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

ScrollTrigger.create({
  trigger: '.stats-bar',
  start: 'top 80%',
  once: true,
  onEnter: animateCounters,
});


// ====== REVEAL ON SCROLL ======
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
revealElements.forEach(el => revealObserver.observe(el));


// ====== PROCESS STEPS ======
document.querySelectorAll('.process-step').forEach((step, i) => {
  ScrollTrigger.create({
    trigger: step,
    start: 'top 75%',
    onEnter: () => {
      step.classList.add('visible');
      step.style.transitionDelay = `${i * 0.1}s`;
    },
  });
});

// Process timeline fill
ScrollTrigger.create({
  trigger: '.process-timeline',
  start: 'top 60%',
  end: 'bottom 40%',
  scrub: true,
  onUpdate: (self) => {
    const fill = document.getElementById('processLineFill');
    if (fill) fill.style.height = `${self.progress * 100}%`;
  },
});


// ====== SERVICE CARDS ======
document.querySelectorAll('.service-card').forEach((card, i) => {
  gsap.fromTo(card,
    { y: 50, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.9, delay: i * 0.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 85%', once: true },
    }
  );
});


// ====== MARQUEE DUPLICATION (for infinite scroll) ======
document.querySelectorAll('.marquee-track').forEach(track => {
  // Clone all cards and append to create seamless infinite loop
  const cards = track.querySelectorAll('.testimonial-card');
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });
});


// ====== PARALLAX ON IMAGES ======
document.querySelectorAll('.process-step-image img, .why-image img').forEach(img => {
  gsap.to(img, {
    y: -30,
    scrollTrigger: {
      trigger: img,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    },
  });
});


// ====== CTA SECTION ======
document.querySelectorAll('.cta-section .reveal').forEach((el, i) => {
  gsap.fromTo(el,
    { y: 40, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.9, delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    }
  );
});


// ====== CONTACT FORM ======
// File upload preview
const fileInput = document.getElementById('sketchUpload');
const filePreview = document.getElementById('filePreview');
const uploadArea = document.getElementById('fileUploadArea');

if (fileInput && filePreview) {
  fileInput.addEventListener('change', () => updateFilePreview());

  // Drag and drop
  if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      fileInput.files = e.dataTransfer.files;
      updateFilePreview();
    });
  }
}

function updateFilePreview() {
  if (!filePreview || !fileInput) return;
  filePreview.innerHTML = '';
  Array.from(fileInput.files).forEach((file, i) => {
    const item = document.createElement('div');
    item.className = 'file-preview-item';
    item.innerHTML = `📄 ${file.name} <span class="remove-file" onclick="removeFile(${i})">✕</span>`;
    filePreview.appendChild(item);
  });
}

function removeFile(index) {
  const dt = new DataTransfer();
  Array.from(fileInput.files).forEach((file, i) => {
    if (i !== index) dt.items.add(file);
  });
  fileInput.files = dt.files;
  updateFilePreview();
}

// Form submission
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const form = document.getElementById('contactForm');

  // Show loading state
  btn.innerHTML = '⏳ Submitting...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  // Simulate submission (replace with real API endpoint)
  setTimeout(() => {
    form.innerHTML = `
      <div class="form-success">
        <h3>✅ Project Submitted!</h3>
        <p>Thanks! We've received your project details. Our team will review your sketch and get back to you within 2 hours during business hours.</p>
      </div>
    `;
  }, 1500);
}

// Expose handleSubmit globally
window.handleSubmit = handleSubmit;
window.removeFile = removeFile;


// ====== SMOOTH ANCHOR SCROLLING ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('navLinks').classList.remove('mobile-open');
    }
  });
});


// ====== MOBILE NAV STYLE ======
const mobileStyle = document.createElement('style');
mobileStyle.textContent = `
  @media (max-width: 768px) {
    .nav-links.mobile-open {
      display: flex !important;
      flex-direction: column;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(10,10,15,0.97);
      backdrop-filter: blur(20px);
      justify-content: center;
      align-items: center;
      gap: 32px;
      z-index: 999;
    }
    .nav-links.mobile-open a {
      font-size: 1.4rem;
      color: #f0f0f5;
    }
  }
`;
document.head.appendChild(mobileStyle);

console.log('The Layer Studio — Landing Page Loaded');
