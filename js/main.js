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
function initSigninModal() {
  const modal = document.getElementById('signinModal');
  const closeButton = document.getElementById('closeSignin');

  const signinView = document.getElementById('signinView');
  const registerView = document.getElementById('registerView');
  const forgotView = document.getElementById('forgotView');
  const otpView = document.getElementById('otpView');
  const resetView = document.getElementById('resetView');

  const showRegister = document.getElementById('showRegister');
  const showSignin = document.getElementById('showSignin');
  const showForgot = document.getElementById('showForgot');
  const forgotBackSignin = document.getElementById('forgotBackSignin');
  const otpBack = document.getElementById('otpBack');
  const resetBackSignin = document.getElementById('resetBackSignin');

  const signinForm = document.getElementById('signinForm');
  const registerForm = document.getElementById('registerForm');
  const forgotForm = document.getElementById('forgotForm');
  const otpForm = document.getElementById('otpForm');
  const resetForm = document.getElementById('resetForm');

  const registerPassword = document.getElementById('registerPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const registerError = document.getElementById('registerError');
  const resetError = document.getElementById('resetError');

  if (!modal || !signinView) return;

  const authViews = [
    signinView,
    registerView,
    forgotView,
    otpView,
    resetView
  ];

  function showAuthView(view) {
    authViews.forEach((item) => {
      item?.classList.remove('active');
    });

    view?.classList.add('active');

    if (registerError) {
      registerError.textContent = '';
    }

    if (resetError) {
      resetError.textContent = '';
    }
  }

  function openModal() {
    showAuthView(signinView);
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  document.addEventListener('click', (event) => {
    const signinButton = event.target.closest('.signin-btn');

    if (!signinButton) return;

    event.preventDefault();
    openModal();
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

  showRegister?.addEventListener('click', () => {
    showAuthView(registerView);
  });

  showSignin?.addEventListener('click', () => {
    showAuthView(signinView);
  });

  showForgot?.addEventListener('click', () => {
    showAuthView(forgotView);
  });

  forgotBackSignin?.addEventListener('click', () => {
    showAuthView(signinView);
  });

  otpBack?.addEventListener('click', () => {
    showAuthView(forgotView);
  });

  resetBackSignin?.addEventListener('click', () => {
    showAuthView(signinView);
  });

  document.querySelectorAll('.password-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.password);

      if (!input) return;

      const passwordVisible = input.type === 'text';

      input.type = passwordVisible ? 'password' : 'text';

      button.innerHTML = passwordVisible
        ? '<i class="bi bi-eye"></i>'
        : '<i class="bi bi-eye-slash"></i>';

      button.setAttribute(
        'aria-label',
        passwordVisible ? 'Show password' : 'Hide password'
      );
    });
  });

  const otpInputs = document.querySelectorAll('.otp-inputs input');

  otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '');

      if (input.value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  signinForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log('Sign in ready for Django backend.');
  });

  registerForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (registerError) {
      registerError.textContent = '';
    }

    if (
      registerPassword &&
      confirmPassword &&
      registerPassword.value !== confirmPassword.value
    ) {
      registerError.textContent = 'Passwords do not match.';
      confirmPassword.focus();
      return;
    }

    console.log('Registration ready for Django backend.');
  });

  forgotForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    // Django will send OTP later.
    showAuthView(otpView);
  });

  otpForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    // Django will verify OTP later.
    showAuthView(resetView);
  });

  resetForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');

    if (!newPassword || !confirmNewPassword) return;

    if (newPassword.value !== confirmNewPassword.value) {
      resetError.textContent = 'Passwords do not match.';
      confirmNewPassword.focus();
      return;
    }

    resetError.textContent = '';

    console.log('Password reset ready for Django backend.');

    resetForm.reset();
    showAuthView(signinView);
  });
}
/* ================= LOAD AUTH MODAL ================= */

async function loadSigninModal() {
  const container = document.getElementById('signin-modal-container');
  if (!container) return;

  try {
    const response = await fetch('components/signin-modal.html');

    if (!response.ok) {
      throw new Error('Could not load auth modal.');
    }

    container.innerHTML = await response.text();
    initSigninModal();
  } catch (error) {
    console.error('Could not load auth modal:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadSigninModal);