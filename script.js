// ============ OPENING HOURS DATA ============
// day index: 0 = Sunday ... 6 = Saturday, hours in 24h [openHour, closeHour]
// closeHour > 24 means it runs past midnight (e.g. 25 = 1 AM next day)
const HOURS = {
  0: { open: 10, close: 22 },   // Sunday
  1: { open: 9, close: 23 },    // Monday
  2: { open: 9, close: 23 },
  3: { open: 9, close: 23 },
  4: { open: 9, close: 23 },
  5: { open: 9, close: 25 },    // Friday, until 1am
  6: { open: 9, close: 25 },    // Saturday, until 1am
};

function isOpenNow(date) {
  const day = date.getDay();
  const hourFloat = date.getHours() + date.getMinutes() / 60;

  // Check today's window
  const today = HOURS[day];
  if (hourFloat >= today.open && hourFloat < Math.min(today.close, 24)) return true;

  // Check if still within yesterday's past-midnight window
  const yesterday = HOURS[(day + 6) % 7];
  if (yesterday.close > 24) {
    const spillHour = yesterday.close - 24;
    if (hourFloat < spillHour) return true;
  }
  return false;
}

function updateStatusPill() {
  const now = new Date();
  const pill = document.getElementById('statusPill');
  const text = document.getElementById('statusText');
  const open = isOpenNow(now);

  pill.classList.remove('open', 'closed');
  pill.classList.add(open ? 'open' : 'closed');
  text.textContent = open ? 'Open now' : 'Closed now';
}

function updateTicket() {
  const now = new Date();
  const dateEl = document.getElementById('ticketDate');
  const timeEl = document.getElementById('ticketTime');
  const statusEl = document.getElementById('ticketStatus');

  dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' });
  timeEl.textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  statusEl.textContent = isOpenNow(now) ? 'OPEN' : 'CLOSED';
}

function highlightToday() {
  const day = new Date().getDay();
  document.querySelectorAll('#hoursTable tr').forEach(row => {
    row.classList.toggle('today', Number(row.dataset.day) === day);
  });
}

// ============ MOBILE NAV ============
function setupNav() {
  const toggle = document.getElementById('navToggle');
  const header = document.querySelector('.site-header');
  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after clicking a link (mobile)
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => header.classList.remove('nav-open'));
  });
}

// ============ SCROLL-SPY (active nav link) ============
function setupScrollSpy() {
  const sections = document.querySelectorAll('main, section[id]');
  const navLinks = document.querySelectorAll('.main-nav a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  document.querySelectorAll('section[id]').forEach(sec => observer.observe(sec));
}

// ============ CONTACT FORM VALIDATION ============
function setupForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    [name, email, message].forEach(f => f.closest('.form-row').classList.remove('invalid'));
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';

    if (!name.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      name.closest('.form-row').classList.add('invalid');
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      email.closest('.form-row').classList.add('invalid');
      valid = false;
    }

    if (!message.value.trim()) {
      messageError.textContent = 'Let us know how we can help.';
      message.closest('.form-row').classList.add('invalid');
      valid = false;
    }

    if (!valid) return;

    // No backend wired up — this is a static front-end demo.
    // In production this would POST to a server endpoint (e.g. Flask route).
    const ticketNo = String(Math.floor(100 + Math.random() * 900));
    document.getElementById('formTicketNo').textContent = `NO. ${ticketNo}`;
    success.hidden = false;
    form.reset();
  });
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  updateStatusPill();
  updateTicket();
  highlightToday();
  setupNav();
  setupScrollSpy();
  setupForm();

  document.getElementById('year').textContent = new Date().getFullYear();

  setInterval(() => {
    updateStatusPill();
    updateTicket();
  }, 30000);
});
