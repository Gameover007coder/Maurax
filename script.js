// ---------- HAMBURGER TOGGLE ----------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close menu on link click (mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
}

// ---------- FAQ ACCORDION ----------
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        // Close all other open items
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

// Open the first FAQ by default
if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
    faqItems[0].querySelector('.faq-answer').classList.add('open');
}

// ---------- CONTACT FORM (Formspree — free API, no backend needed) ----------
// 1. Go to https://formspree.io and sign up free (no credit card).
// 2. Create a new form — Formspree gives you an endpoint like:
//    https://formspree.io/f/abcdwxyz
// 3. Paste that endpoint below in place of "YOUR_FORM_ID".
// Free tier currently allows 50 submissions/month, delivered straight to your inbox.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Guard: remind whoever is testing this locally to add their endpoint
        if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
            showStatus('error', 'Contact form is not connected yet — add your free Formspree endpoint in script.js.');
            return;
        }

        showStatus('sending', 'Sending your message...');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

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

function showStatus(type, message) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status show ${type}`;
}
