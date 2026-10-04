const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isArabic = document.documentElement.lang === 'ar';
const reveals = document.querySelectorAll('.reveal');
reveals.forEach(el => [...el.children].forEach((child, i) => child.style.setProperty('--i', i)));
if (reduceMotion || !('IntersectionObserver' in window)) reveals.forEach(el => el.classList.add('is-visible'));
else {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: .18 });
  reveals.forEach(el => observer.observe(el));
}

const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('#mobile-menu');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileMenu.hidden = open;
  document.body.classList.toggle('menu-open', !open);
});
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false'); mobileMenu.hidden = true; document.body.classList.remove('menu-open');
}));

document.querySelectorAll('.language-switch').forEach(link => link.addEventListener('click', () => {
  if (location.hash) link.href = `${link.getAttribute('href').split('#')[0]}${location.hash}`;
}));

const hero = document.querySelector('.hero');
const heroStyleButtons = document.querySelectorAll('[data-hero-style]');
const applyHeroStyle = style => {
  const next = style === 'charcoal' ? 'charcoal' : 'warm';
  hero?.classList.toggle('hero-option-charcoal', next === 'charcoal');
  hero?.classList.toggle('hero-option-warm', next === 'warm');
  heroStyleButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.heroStyle === next)));
};
applyHeroStyle(localStorage.getItem('alabaad-hero-style') || 'warm');
heroStyleButtons.forEach(button => button.addEventListener('click', () => {
  applyHeroStyle(button.dataset.heroStyle);
  localStorage.setItem('alabaad-hero-style', button.dataset.heroStyle);
}));

document.querySelectorAll('.pillar').forEach(pillar => pillar.addEventListener('click', () => {
  pillar.setAttribute('aria-expanded', String(pillar.getAttribute('aria-expanded') !== 'true'));
}));

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.desktop-nav a');
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  }), { rootMargin: '-35% 0px -55%' });
  sections.forEach(section => navObserver.observe(section));
}

const form = document.querySelector('#contact-form');
form?.addEventListener('submit', event => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  const invalid = [...form.querySelectorAll('[required]')].find(field => !field.validity.valid);
  if (invalid) {
    const arabicNames = { name: 'الاسم', email: 'البريد الإلكتروني', subject: 'المشروع أو الاستفسار', message: 'الرسالة' };
    status.hidden = false; status.className = 'form-status error'; status.textContent = isArabic ? `يرجى استكمال حقل ${arabicNames[invalid.name] || invalid.name} بصورة صحيحة.` : `Please complete ${invalid.name === 'subject' ? 'project or enquiry' : invalid.name} correctly.`; invalid.focus(); return;
  }
  const data = new FormData(form);
  const body = isArabic ? `الاسم: ${data.get('name')}\nالشركة: ${data.get('company')}\nالبريد الإلكتروني: ${data.get('email')}\nالهاتف: ${data.get('phone')}\n\n${data.get('message')}` : `Name: ${data.get('name')}\nCompany: ${data.get('company')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')}\n\n${data.get('message')}`;
  status.hidden = false; status.className = 'form-status'; status.textContent = isArabic ? 'استفسارك جاهز. سيفتح تطبيق البريد لتختار جهة الاستلام المعتمدة.' : 'Your enquiry is ready. Your email app will open so you can choose the verified recipient.';
  setTimeout(() => location.href = `mailto:?subject=${encodeURIComponent(data.get('subject'))}&body=${encodeURIComponent(body)}`, 250);
});
