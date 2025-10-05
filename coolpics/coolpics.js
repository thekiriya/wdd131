// Simple accessible menu toggle for mobile
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('menuToggle');
  const nav = document.getElementById('siteNav');

  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav if a link is clicked (mobile)
  nav.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'a') {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Optional: close the menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });
});
