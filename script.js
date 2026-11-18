const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const menuToggle = $('.menu-toggle');
const mainNav = $('.main-nav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
$$('.main-nav a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const modal = $('#details-modal');
const openModal = () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  $('.modal-close').focus();
};
const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
};
$('#quality-details').addEventListener('click', openModal);
$('#footer-details').addEventListener('click', openModal);
$('.modal-close').addEventListener('click', closeModal);
$('.modal-done').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });

const drawer = $('#order-drawer');
const scrim = $('#drawer-scrim');
const form = $('#order-form');
let selectedQty = 1;
const bundleNames = {1:'Single box', 2:'Double box', 3:'Triple box', 9:'Family pack'};
function openDrawer(qty = selectedQty) {
  selectedQty = qty;
  $('#selected-name').textContent = bundleNames[qty];
  $('#selected-quantity').textContent = `${qty} ${qty === 1 ? 'box' : 'boxes'} · ${qty * 10} sachets`;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  scrim.classList.add('open');
  document.body.classList.add('no-scroll');
  $('#customer-name').focus({preventScroll:true});
}
function closeDrawer() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  scrim.classList.remove('open');
  document.body.classList.remove('no-scroll');
}
$$('.bundle-card').forEach(card => {
  card.querySelector('.bundle-button').addEventListener('click', () => openDrawer(Number(card.dataset.qty)));
});
$('.drawer-close').addEventListener('click', closeDrawer);
scrim.addEventListener('click', closeDrawer);
$('#change-bundle').addEventListener('click', () => {
  closeDrawer();
  $('#bundles').scrollIntoView({behavior:'smooth'});
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const status = $('#form-status');
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const enquiry = {
    name: data.get('name').trim(),
    contact: data.get('contact').trim(),
    address: data.get('address').trim(),
    note: data.get('note').trim(),
    bundle: bundleNames[selectedQty],
    quantity: selectedQty,
    sachets: selectedQty * 10
  };
  // Front-end demonstration only: no order is transmitted or stored.
  status.classList.remove('error');
  status.textContent = `Thanks, ${enquiry.name}! Your ${enquiry.bundle.toLowerCase()} enquiry is ready. This demo form doesn’t send orders yet, so connect it to your order system before going live.`;
  form.querySelector('.submit-order').textContent = 'Enquiry ready ✓';
  form.querySelector('.submit-order').disabled = true;
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (modal.classList.contains('open')) closeModal();
    if (drawer.classList.contains('open')) closeDrawer();
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Subtle reveal-on-scroll; content remains visible when reduced motion is preferred.
const revealTargets = $$('.ingredient-card, .goodness-item, .step-card, .bundle-card, .quality-stamp');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  revealTargets.forEach(el => observer.observe(el));
}
