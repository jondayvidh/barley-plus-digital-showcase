const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

/* Navigation */
const menuToggle = $('.menu-toggle');
const mainNav = $('.main-nav');

function setNavOpen(isOpen) {
  mainNav.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
}
menuToggle.addEventListener('click', () => setNavOpen(!mainNav.classList.contains('open')));
$$('.main-nav a').forEach(link => link.addEventListener('click', () => setNavOpen(false)));

/* Product details modal */
const modal = $('#details-modal');

function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  $('.modal-close').focus();
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}
$('#quality-details').addEventListener('click', openModal);
$('#footer-details').addEventListener('click', openModal);
$('.modal-close').addEventListener('click', closeModal);
$('.modal-done').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });

/* Order enquiry drawer */
const drawer = $('#order-drawer');
const scrim = $('#drawer-scrim');
const form = $('#order-form');
const bundleNames = {1: 'Single box', 2: 'Double box', 3: 'Triple box', 9: 'Family pack'};
let selectedQty = 1;

function openDrawer(qty) {
  selectedQty = qty;
  $('#selected-name').textContent = bundleNames[qty];
  $('#selected-quantity').textContent = `${qty} ${qty === 1 ? 'box' : 'boxes'} · ${qty * 10} sachets`;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  scrim.classList.add('open');
  document.body.classList.add('no-scroll');
  $('#customer-name').focus({preventScroll: true});
}
function closeDrawer() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  scrim.classList.remove('open');
  document.body.classList.remove('no-scroll');
}
$$('.bundle-card').forEach(card => {
  $('.bundle-button', card).addEventListener('click', () => openDrawer(Number(card.dataset.qty)));
});
$('.drawer-close').addEventListener('click', closeDrawer);
scrim.addEventListener('click', closeDrawer);
$('#change-bundle').addEventListener('click', () => {
  closeDrawer();
  $('#bundles').scrollIntoView({behavior: 'smooth'});
});

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  // Front-end demonstration only: no order is transmitted or stored.
  const name = $('#customer-name').value.trim();
  const submitButton = $('.submit-order');
  $('#form-status').textContent = `Thanks, ${name}! Your ${bundleNames[selectedQty].toLowerCase()} enquiry is ready. This demo form doesn’t send orders yet, so connect it to your order system before going live.`;
  submitButton.textContent = 'Enquiry ready ✓';
  submitButton.disabled = true;
});

/* Escape closes anything open */
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  closeModal();
  closeDrawer();
  setNavOpen(false);
});

/* Reveal on scroll (skipped when reduced motion is preferred) */
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealTargets = $$('.ingredient-card, .goodness-item, .step-card, .bundle-card, .quality-stamp');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  revealTargets.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}
