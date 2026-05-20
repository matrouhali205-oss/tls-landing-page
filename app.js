// ===== NAV: transparent over hero, darkens on scroll =====
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  const onScroll = () => mainNav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}


// ===== MOBILE NAV DRAWER =====
const navToggle = document.getElementById('navToggle');
const mobileDrawer = document.getElementById('mobileDrawer');

if (navToggle && mobileDrawer) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  mobileDrawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}


// ===== SCROLL REVEAL =====
const srObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      srObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.sr').forEach(el => srObserver.observe(el));


// ===== STATS COUNTER =====
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.dataset.count) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));


// ===== SVG DRAWING ANIMATION =====
const drawObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.draw-path, .draw-path-gold').forEach(path => {
        path.classList.add('animate');
      });
      drawObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.arch-drawing').forEach(el => drawObserver.observe(el));


// ===== SUBMIT FORM (submit.html only) =====
const step1El = document.getElementById('step1');
const submitFormEl = document.getElementById('submitForm');

if (step1El && submitFormEl) {
  initSubmitForm();
}

function initSubmitForm() {
  const nextBtn      = document.getElementById('nextBtn');
  const backBtn      = document.getElementById('backBtn');
  const dot1         = document.getElementById('dot1');
  const dot2         = document.getElementById('dot2');
  const stepLabel    = document.getElementById('stepLabel');
  const successState = document.getElementById('successState');
  const stepBar      = document.querySelector('.step-bar');

  let selectedType = '';

  document.querySelectorAll('input[name="clientType"]').forEach(input => {
    input.addEventListener('change', () => { selectedType = input.value; });
  });

  nextBtn.addEventListener('click', () => {
    if (!selectedType) {
      const cards = document.querySelector('.client-cards');
      cards.style.outline = '1.5px solid #c9a84c';
      setTimeout(() => { cards.style.outline = ''; }, 1400);
      return;
    }
    step1El.style.display = 'none';
    submitFormEl.classList.remove('hidden');
    dot1.classList.remove('active');
    dot1.classList.add('done');
    dot2.classList.add('active');
    stepLabel.textContent = 'Project Details';
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('show'));
    const section = document.getElementById('form-' + selectedType);
    if (section) section.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  backBtn.addEventListener('click', () => {
    submitFormEl.classList.add('hidden');
    step1El.style.display = 'block';
    dot2.classList.remove('active');
    dot1.classList.remove('done');
    dot1.classList.add('active');
    stepLabel.textContent = 'I am a…';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  wireUpload('fileUpload',   'fileChips',   'uploadZone');
  wireUpload('fileUploadRE', 'fileChipsRE', 'uploadZoneRE');
  wireUpload('fileUploadHO', 'fileChipsHO', 'uploadZoneHO');

  function wireUpload(inputId, chipsId, zoneId) {
    const input = document.getElementById(inputId);
    const chips = document.getElementById(chipsId);
    const zone  = document.getElementById(zoneId);
    if (!input || !chips) return;

    input.addEventListener('change', () => renderChips(input, chips));

    if (zone) {
      zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('over'); });
      zone.addEventListener('dragleave', ()  => zone.classList.remove('over'));
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('over');
        input.files = e.dataTransfer.files;
        renderChips(input, chips);
      });
    }

    window['removeChip_' + inputId] = function(index) {
      const dt = new DataTransfer();
      Array.from(input.files).forEach((f, i) => { if (i !== index) dt.items.add(f); });
      input.files = dt.files;
      renderChips(input, chips);
    };
  }

  function renderChips(input, chips) {
    chips.innerHTML = '';
    Array.from(input.files).forEach((file, i) => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.innerHTML =
        `<span>${file.name}</span>` +
        `<button type="button" onclick="removeChip_${input.id}(${i})">×</button>`;
      chips.appendChild(chip);
    });
  }

  submitFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    const nameVal  = document.getElementById('name').value.trim();
    const emailVal = document.getElementById('email').value.trim();
    const phoneVal = document.getElementById('phone').value.trim();

    const fileInputMap = { contractor: 'fileUpload', realest: 'fileUploadRE', homeowner: 'fileUploadHO' };
    const activeFile   = document.getElementById(fileInputMap[selectedType]);

    try {
      const data = new FormData();
      data.append('access_key',  'e8def23f-4955-44cf-b1af-9fd2173e03b2');
      data.append('subject',     '🏗️ New Project — TLS Studio (' + selectedType + ')');
      data.append('from_name',   'TLS Studio Website');
      data.append('redirect',    'false');
      data.append('client_type', selectedType);
      data.append('name',        nameVal);
      data.append('email',       emailVal);
      data.append('phone',       phoneVal || 'Not provided');

      if (selectedType === 'contractor') {
        data.append('company',         document.getElementById('company').value.trim());
        data.append('project_type',    document.getElementById('projectType').value);
        const services = [...document.querySelectorAll('#form-contractor input[name="services"]:checked')]
          .map(c => c.value).join(', ');
        data.append('services_needed', services || 'None selected');
        data.append('project_address', document.getElementById('contractorAddress').value.trim());
        data.append('timeline',        document.getElementById('timeline').value);

      } else if (selectedType === 'realest') {
        data.append('brokerage',        document.getElementById('brokerage').value.trim());
        const services = [...document.querySelectorAll('#form-realest input[name="services"]:checked')]
          .map(c => c.value).join(', ');
        data.append('services_needed',  services || 'None selected');
        const meas = document.querySelector('input[name="has_measurements"]:checked');
        data.append('has_measurements', meas ? meas.value : 'Not specified');

      } else if (selectedType === 'homeowner') {
        data.append('project_goal', document.getElementById('projectGoal').value.trim());
        const sketches = document.querySelector('input[name="has_sketches"]:checked');
        data.append('has_sketches', sketches ? sketches.value : 'Not specified');
        data.append('budget',       document.getElementById('budget').value);
      }

      if (activeFile && activeFile.files.length > 0) {
        Array.from(activeFile.files).forEach(file => data.append('attachment', file));
      }

      const res    = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const result = await res.json();
      console.log('Web3Forms response:', result);

      if (result.success) {
        submitFormEl.classList.add('hidden');
        step1El.style.display = 'none';
        if (stepBar) stepBar.style.display = 'none';
        successState.classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Project →';
      const subject = encodeURIComponent('New Project — ' + selectedType + ' — ' + nameVal);
      const body    = encodeURIComponent('Name: ' + nameVal + '\nEmail: ' + emailVal + '\nType: ' + selectedType);
      const prev = submitFormEl.querySelector('.error-banner');
      if (prev) prev.remove();
      const errMsg = err.message ? ` (${err.message})` : '';
      submitFormEl.insertAdjacentHTML('afterbegin',
        `<div class="error-banner">Form error${errMsg}. ` +
        `<a href="mailto:support@thelayerstudio.dev?subject=${subject}&body=${body}">Send via email →</a></div>`);
    }
  });
}
