const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const menuToggle = $('.menu-toggle');
const mainNav = $('.main-nav');
const modal = $('#details-modal');
const modalClose = $('.modal-close');
const drawer = $('#order-drawer');
const scrim = $('#drawer-scrim');
const form = $('#order-form');
const formStatus = $('#form-status');
const submitButton = $('.submit-order');

const bundleNames = {1: 'Single box', 2: 'Double box', 3: 'Triple box', 9: 'Family pack'};
const submitDefaultHTML = submitButton.innerHTML;
let selectedQty = 1;
let enquirySent = false;

function setNavOpen(isOpen) {
  mainNav.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
}

function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

function resetEnquiry() {
  if (!enquirySent) return;
  form.reset();
  formStatus.textContent = '';
  submitButton.innerHTML = submitDefaultHTML;
  submitButton.disabled = false;
  enquirySent = false;
}

function openDrawer(qty) {
  if (!bundleNames[qty]) return;
  resetEnquiry();
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

menuToggle.addEventListener('click', () => setNavOpen(!mainNav.classList.contains('open')));
$$('.main-nav a').forEach(link => link.addEventListener('click', () => setNavOpen(false)));

$$('#quality-details, #footer-details').forEach(button => button.addEventListener('click', openModal));
$$('.modal-close, .modal-done').forEach(button => button.addEventListener('click', closeModal));
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });

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
  if (enquirySent || !form.reportValidity()) return;
  enquirySent = true;
  const name = $('#customer-name').value.trim();
  formStatus.textContent = `Thanks, ${name}! Your ${bundleNames[selectedQty].toLowerCase()} enquiry is ready. This demo form doesn’t send orders yet, so connect it to your order system before going live.`;
  submitButton.textContent = 'Enquiry ready ✓';
  submitButton.disabled = true;
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  closeModal();
  closeDrawer();
  setNavOpen(false);
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {threshold: 0.12});
  $$('.ingredient-card, .goodness-item, .step-card, .bundle-card, .quality-stamp').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}
