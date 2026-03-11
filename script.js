const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/2JQAbeR5jKcgMC4yCu90/webhook-trigger/e1c7cd16-01fa-414f-b2a1-c6c4a6ba8d1b';

document.getElementById('contactForm').addEventListener('submit', async function (e) {
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
