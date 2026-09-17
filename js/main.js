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
