/* SHARED COMPONENTS */

async function loadComponent(id, path) {
  const container = document.getElementById(id);
  if (!container) return;

  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Failed to load ${path}`);
    }

    container.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

async function loadLayout() {
  await Promise.all([
    loadComponent('navbar', 'components/navbar.html'),
    loadComponent('footer', 'components/footer.html')
  ]);

  setActiveNav();
  setCurrentYear();
}

function setActiveNav() {
  const currentPage = document.body.dataset.page;
  const activeLink = document.querySelector(`.nav-link[data-page="${currentPage}"]`);

  if (activeLink) {
    activeLink.classList.add('active');
  }
}

function setCurrentYear() {
  const year = document.getElementById('currentYear');

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}
document.addEventListener('DOMContentLoaded', loadLayout);
/* BOOKING SERVICE SWITCHER */

const serviceOptions = document.querySelectorAll('.service-option');
const serviceForms = document.querySelectorAll('.service-form');

function selectService(service) {
  serviceOptions.forEach((item) => {
    item.classList.toggle('active', item.dataset.service === service);
  });

  serviceForms.forEach((form) => {
    form.classList.remove('active');
  });

  if (service === 'driver') {
    document.getElementById('driverForm')?.classList.add('active');
  } else if (service === 'self') {
    document.getElementById('selfForm')?.classList.add('active');
  } else {
    document.getElementById('rentForm')?.classList.add('active');
  }
}

serviceOptions.forEach((option) => {
  option.addEventListener('click', () => {
    selectService(option.dataset.service);
  });
});

const params = new URLSearchParams(window.location.search);
const selectedService = params.get('service');

if (selectedService === 'driver' || selectedService === 'self' || selectedService === 'rent') {
  selectService(selectedService);
}
const whySection = document.querySelector('.why-section');
if (whySection) {
  const whyObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          whySection.classList.add('animate');
          observer.unobserve(whySection);
        }
      });
    },
    {
      threshold: 0.3
    });
  whyObserver.observe(whySection);
}
/*STATS COUNTER*/

const statsSection = document.querySelector('.stats-section');
const counters = document.querySelectorAll('.counter');
let countersStarted = false;
function startCounters() {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target);
    const duration = 1800;
    const startTime = performance.now();
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(target * easeOut);
      counter.textContent = currentValue.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(updateCounter);
  });
}
if (statsSection) {
  const statsObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            startCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.35
      }
    );
  statsObserver.observe(statsSection);
}
/* CORPORATE PARTNER FORM */
const partnerForm = document.getElementById('partnerForm');

if (partnerForm) {
  partnerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const modalElement = document.getElementById('partnerModal');
    const modal = bootstrap.Modal.getInstance(modalElement);

    modal.hide();
    partnerForm.reset();

    alert('Your corporate rental request has been submitted.');
  });
}
/* ================= ABOUT WING ANIMATION ================= */

const aboutOverview = document.querySelector('.about-overview');

if (aboutOverview) {
  const aboutObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          aboutOverview.classList.add('animate');
          observer.unobserve(aboutOverview);
        }
      });
    },
    {
      threshold: 0.25
    }
  );

  aboutObserver.observe(aboutOverview);
}


/* ================= ABOUT QUALITY TABS ================= */

const qualityTabs = document.querySelectorAll('.quality-tab');
const qualityTitle = document.getElementById('qualityTitle');
const qualityText = document.getElementById('qualityText');

const qualityData = {
  luxury: {
    title: 'Luxury Collection',
    text: 'Travel in refined vehicles designed for journeys where comfort, style and a premium experience matter.'
  },

  comfort: {
    title: 'Comfort Collection',
    text: 'Choose comfortable and practical vehicles designed for everyday travel, family journeys and longer road trips.'
  },

  prestige: {
    title: 'Prestige Collection',
    text: 'Experience premium vehicles suited to business travel, special occasions and journeys that deserve something distinctive.'
  }
};

if (qualityTabs.length && qualityTitle && qualityText) {
  qualityTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selected = tab.dataset.quality;
      const data = qualityData[selected];

      if (!data) {
        return;
      }

      qualityTabs.forEach((item) => {
        item.classList.remove('active');
      });

      tab.classList.add('active');

      qualityTitle.style.opacity = '0';
      qualityText.style.opacity = '0';

      setTimeout(() => {
        qualityTitle.textContent = data.title;
        qualityText.textContent = data.text;

        qualityTitle.style.opacity = '1';
        qualityText.style.opacity = '1';
      }, 150);
    });
  });
}
/* ================= SIGN IN MODAL ================= */

async function loadSigninModal() {
  const container = document.getElementById('signin-modal-container');

  if (!container) return;

  try {
    const response = await fetch('components/signin-modal.html');
    const html = await response.text();

    container.innerHTML = html;

    initSigninModal();
  } catch (error) {
    console.error('Could not load sign in modal:', error);
  }
}

function initSigninModal() {
  const modal = document.getElementById('signinModal');
  const closeButton = document.getElementById('closeSignin');
  const passwordToggle = document.getElementById('passwordToggle');
  const passwordInput = document.getElementById('signinPassword');
  const signinForm = document.getElementById('signinForm');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  document.addEventListener('click', (event) => {
    const signinButton = event.target.closest('.signin-btn');

    if (signinButton) {
      event.preventDefault();
      openModal();
    }
  });

  closeButton?.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  passwordToggle?.addEventListener('click', () => {
    const showingPassword = passwordInput.type === 'text';

    passwordInput.type = showingPassword ? 'password' : 'text';

    passwordToggle.innerHTML = showingPassword
      ? '<i class="bi bi-eye"></i>'
      : '<i class="bi bi-eye-slash"></i>';
  });

  signinForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log('Sign in form ready for Django backend.');
  });
}

loadSigninModal();