const serviceOptions = document.querySelectorAll('.service-option');

serviceOptions.forEach((option) => {

  option.addEventListener('click', () => {

    serviceOptions.forEach((item) => {
      item.classList.remove('active');
    });

    option.classList.add('active');

  });

});
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
const currentYear = document.getElementById('currentYear');

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}