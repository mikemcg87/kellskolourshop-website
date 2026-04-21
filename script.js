const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/2JQAbeR5jKcgMC4yCu90/webhook-trigger/e1c7cd16-01fa-414f-b2a1-c6c4a6ba8d1b';

// Cookie consent — updates Google Consent Mode v2 based on stored choice
(function () {
  const STORAGE_KEY = 'kks_consent_v1';
  const stored = localStorage.getItem(STORAGE_KEY);

  const applyConsent = (granted) => {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
      });
    }
  };

  if (stored === 'granted') applyConsent(true);
  if (stored === 'denied') applyConsent(false);

  if (stored) return; // already made a choice, don't show banner

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p>We use cookies to understand how the site is used. Analytics only — no advertising.
    <a href="/privacy/">Privacy policy</a>.</p>
    <div class="cookie-banner-actions">
      <button type="button" class="btn btn-outline cookie-btn-deny">Decline</button>
      <button type="button" class="btn btn-primary cookie-btn-accept">Accept</button>
    </div>
  `;
  document.body.appendChild(banner);

  const dismiss = (choice) => {
    localStorage.setItem(STORAGE_KEY, choice);
    applyConsent(choice === 'granted');
    banner.classList.add('cookie-banner-hide');
    setTimeout(() => banner.remove(), 250);
  };

  banner.querySelector('.cookie-btn-accept').addEventListener('click', () => dismiss('granted'));
  banner.querySelector('.cookie-btn-deny').addEventListener('click', () => dismiss('denied'));
})();

// Video testimonial modal
(function () {
  const modal = document.getElementById('videoModal');
  const player = document.getElementById('videoModalPlayer');
  const closeBtn = document.getElementById('videoModalClose');
  if (!modal || !player || !closeBtn) return;

  const open = (src, poster) => {
    player.src = src;
    if (poster) player.poster = poster;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    player.play().catch(() => {});
  };

  const close = () => {
    player.pause();
    player.removeAttribute('src');
    player.load();
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.phone-card').forEach((card) => {
    card.addEventListener('click', () => {
      open(card.dataset.video, card.dataset.poster);
    });
  });

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
  });
})();

const contactForm = document.getElementById('contactForm');
if (contactForm) contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn = this.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  btn.disabled = true;
  btn.textContent = 'Sending...';

  const payload = {
    name: this.name.value,
    phone: this.phone.value,
    message: this.message.value,
    source: 'Website Contact Form',
  };

  try {
    await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    success.classList.remove('hidden');
    this.reset();
  } catch (err) {
    // Still show success to user — log the error
    console.error('Form submission error:', err);
    success.classList.remove('hidden');
    this.reset();
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Message';
  }
});
