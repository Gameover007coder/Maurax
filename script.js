// =====================================================================
// MAURAX — script.js
// =====================================================================

// ---------- HAMBURGER TOGGLE ----------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- FAQ ACCORDION ----------
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    faqItems.forEach(other => {
      if (other !== item) {
        other.classList.remove('active');
        other.querySelector('.faq-answer').classList.remove('open');
      }
    });
    item.classList.toggle('active');
    answer.classList.toggle('open');
  });
});

if (faqItems.length > 0) {
  faqItems[0].classList.add('active');
  faqItems[0].querySelector('.faq-answer').classList.add('open');
}

// ---------- SCROLL REVEAL ----------
const revealTargets = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('in-view'));
}

// ---------- ANIMATED STAT COUNTERS ----------
const counters = document.querySelectorAll('[data-count]');

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if ('IntersectionObserver' in window && counters.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
}

// ---------- HERO ROTATOR ----------
const rotatorTag = document.querySelector('.hero-rotator .tag');
const rotatorWords = ['Restaurants', 'Salons', 'Gyms', 'Clothing Stores', 'Local Shops', 'Clinics'];

if (rotatorTag) {
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % rotatorWords.length;
    const span = document.createElement('span');
    span.textContent = rotatorWords[idx];
    rotatorTag.innerHTML = '';
    rotatorTag.appendChild(span);
  }, 2600);
}

// ---------- RISE DIVIDER DRAW-ON ----------
const riseDividers = document.querySelectorAll('.rise-divider');

if ('IntersectionObserver' in window && riseDividers.length) {
  const riseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        riseObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  riseDividers.forEach(el => riseObserver.observe(el));
}

// ---------- BACK TO TOP ----------
const toTopBtn = document.getElementById('toTop');

if (toTopBtn) {
  window.addEventListener('scroll', () => {
    toTopBtn.classList.toggle('visible', window.scrollY > 500);
  });
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =====================================================================
// CONTACT FORM — API CONNECTION
// =====================================================================
// Drop your real endpoint in below once you have it. This works with:
//  • Formspree            → 'https://formspree.io/f/YOUR_FORM_ID'
//  • Web3Forms            → 'https://api.web3forms.com/submit' (needs access_key field)
//  • EmailJS / a custom backend → any URL that accepts a POST with JSON or FormData
//
// Until a real endpoint is set, the form validates normally and falls back
// to opening the visitor's email client with the message pre-filled, so it
// still "works" end to end for testing.
// =====================================================================
const CONTACT_CONFIG = {
  endpoint: 'YOUR_FORM_ENDPOINT_HERE', // <-- paste the real API/form endpoint here
  method: 'POST',
  // If your endpoint expects JSON instead of multipart form-data, set to true.
  sendAsJson: false,
  fallbackEmail: 'hello@maurax.com'
};

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function showStatus(type, message) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status show ${type}`;
}

function setFieldError(group, hasError) {
  group.classList.toggle('error', hasError);
}

function validateForm(form) {
  let valid = true;
  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const message = form.querySelector('#message');

  const nameGroup = name.closest('.form-group');
  const emailGroup = email.closest('.form-group');
  const messageGroup = message.closest('.form-group');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameOk = name.value.trim().length > 1;
  setFieldError(nameGroup, !nameOk);
  if (!nameOk) valid = false;

  const emailOk = emailPattern.test(email.value.trim());
  setFieldError(emailGroup, !emailOk);
  if (!emailOk) valid = false;

  const messageOk = message.value.trim().length > 4;
  setFieldError(messageGroup, !messageOk);
  if (!messageOk) valid = false;

  return valid;
}

if (contactForm) {
  // Clear error state as the visitor fixes a field
  contactForm.querySelectorAll('input[required], textarea[required]').forEach(field => {
    field.addEventListener('input', () => {
      field.closest('.form-group').classList.remove('error');
    });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(contactForm)) {
      showStatus('error', 'Please fix the highlighted fields and try again.');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    const formData = new FormData(contactForm);

    const endpointConfigured = CONTACT_CONFIG.endpoint &&
      !CONTACT_CONFIG.endpoint.includes('YOUR_FORM_ENDPOINT_HERE');

    if (!endpointConfigured) {
      // Graceful fallback: open a pre-filled email so the form is functional now.
      const subject = encodeURIComponent(`New enquiry from ${formData.get('name')}`);
      const bodyLines = [
        `Name: ${formData.get('name')}`,
        `Email: ${formData.get('email')}`,
        `Phone: ${formData.get('phone') || '—'}`,
        `Business: ${formData.get('business') || '—'}`,
        '',
        formData.get('message')
      ];
      const body = encodeURIComponent(bodyLines.join('\n'));
      window.location.href = `mailto:${CONTACT_CONFIG.fallbackEmail}?subject=${subject}&body=${body}`;
      showStatus('sending', "Opening your email app to send this — once we give you a live API endpoint, this will submit instantly instead.");
      return;
    }

    showStatus('sending', 'Sending your message...');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const requestOptions = { method: CONTACT_CONFIG.method, headers: { 'Accept': 'application/json' } };

      if (CONTACT_CONFIG.sendAsJson) {
        const payload = Object.fromEntries(formData.entries());
        requestOptions.headers['Content-Type'] = 'application/json';
        requestOptions.body = JSON.stringify(payload);
      } else {
        requestOptions.body = formData;
      }

      const response = await fetch(CONTACT_CONFIG.endpoint, requestOptions);

      if (response.ok) {
        showStatus('success', "Thanks! Your message is on its way — we'll get back to you soon.");
        contactForm.reset();
      } else {
        const data = await response.json().catch(() => null);
        const msg = (data && data.errors && data.errors.map(er => er.message).join(', ')) ||
          'Something went wrong sending your message. Please try again.';
        showStatus('error', msg);
      }
    } catch (err) {
      showStatus('error', 'Network error — please check your connection and try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}
