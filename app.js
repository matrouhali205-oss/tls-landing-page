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
async function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const form = document.getElementById('contactForm');

  btn.innerHTML = '⏳ Submitting...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const projectType = document.getElementById('projectType').value;
  const description = document.getElementById('description').value;
  const pkg = form.querySelector('input[name="package"]:checked')?.value || '';

  try {
    const data = new FormData();
    data.append('fullName', fullName);
    data.append('email', email);
    data.append('phone', phone);
    data.append('projectType', projectType);
    data.append('description', description);
    data.append('package', pkg);
    data.append('_subject', '🏗️ New Project Submission — The Layer Studio');
    data.append('_captcha', 'false');
    data.append('_template', 'table');
    data.append('_autoresponse', 'Thank you for choosing The Layer Studio! If you selected a Standard or Pro package, this email serves as your formal deposit invoice (Standard: $325 CAD | Pro: $425 CAD). If you selected Custom Quote, our team will review your project and send you a custom invoice shortly. Please send your deposit via Interac e-Transfer to payment@thelayerstudio.dev. Once your transfer is received, our drafting team will begin immediately!');

    const fileInput = document.getElementById('sketchUpload');
    if (fileInput && fileInput.files.length > 0) {
      Array.from(fileInput.files).forEach(file => data.append('attachment', file));
    }

    const res = await fetch('https://formsubmit.co/ajax/support@thelayerstudio.dev', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data,
    });

    if (res.ok) {
      window.location.href = 'thankyou.html';
    } else {
      throw new Error('Submission failed');
    }
  } catch (err) {
    const subject = encodeURIComponent(`New Project: ${projectType} — ${fullName}`);
    const body = encodeURIComponent(
      `Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nProject Type: ${projectType}\nPackage: ${pkg}\n\nDescription:\n${description}`
    );
    form.innerHTML = `
      <div class="form-success">
        <h3>📧 Almost There!</h3>
        <p>Our form service is temporarily unavailable. Please send your details directly — we'll respond within 2 hours.</p>
        <a href="mailto:support@thelayerstudio.dev?subject=${subject}&body=${body}" class="btn-primary" style="margin-top:20px;display:inline-flex;justify-content:center;">Send via Email →</a>
      </div>
    `;
  }
}

window.removeFile = removeFile;

// Wire form to handleSubmit so JS intercepts before the native POST
const contactForm = document.getElementById('contactForm');
if (contactForm) contactForm.addEventListener('submit', handleSubmit);

// Package pre-selection from pricing cards
function selectPackage(pkg) {
  setTimeout(() => {
    const radios = document.querySelectorAll('input[name="package"]');
    if (pkg === 'standard' && radios[0]) radios[0].checked = true;
    if (pkg === 'pro' && radios[1]) radios[1].checked = true;
    if (pkg === 'custom' && radios[2]) radios[2].checked = true;
  }, 500);
}
window.selectPackage = selectPackage;


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
