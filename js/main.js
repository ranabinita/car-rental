/* =========================
   SHARED COMPONENTS
========================= */

async function loadComponent(id, path) {
  const container = document.getElementById(id);
  if (!container) return;

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
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
  if (activeLink) activeLink.classList.add('active');
}

function setCurrentYear() {
  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', loadLayout);


/* =========================
   BOOKING SERVICE SWITCHER
========================= */

const serviceOptions = document.querySelectorAll('.service-option');
const serviceForms = document.querySelectorAll('.service-form');

function selectService(service) {
  serviceOptions.forEach((item) => {
    item.classList.toggle('active', item.dataset.service === service);
  });

  serviceForms.forEach((form) => form.classList.remove('active'));

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

if (['driver', 'self', 'rent'].includes(selectedService)) {
  selectService(selectedService);
}


/* =========================
   WHY SECTION ANIMATION
========================= */

const whySection = document.querySelector('.why-section');

if (whySection) {
  const whyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        whySection.classList.add('animate');
        observer.unobserve(whySection);
      }
    });
  }, { threshold: 0.3 });

  whyObserver.observe(whySection);
}


/* =========================
   STATS COUNTER
========================= */

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
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        startCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  statsObserver.observe(statsSection);
}


/* =========================
   CORPORATE PARTNER FORM
========================= */

const partnerForm = document.getElementById('partnerForm');

if (partnerForm) {
  partnerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const modalElement = document.getElementById('partnerModal');
    const modal = bootstrap.Modal.getInstance(modalElement);

    modal?.hide();
    partnerForm.reset();

    alert('Your corporate rental request has been submitted.');
  });
}


/* =========================
   ABOUT WING ANIMATION
========================= */

const aboutOverview = document.querySelector('.about-overview');

if (aboutOverview) {
  const aboutObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        aboutOverview.classList.add('animate');
        observer.unobserve(aboutOverview);
      }
    });
  }, { threshold: 0.25 });

  aboutObserver.observe(aboutOverview);
}


/* =========================
   ABOUT QUALITY TABS
========================= */

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
      const data = qualityData[tab.dataset.quality];
      if (!data) return;

      qualityTabs.forEach((item) => item.classList.remove('active'));
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


/* =========================
   AUTH MODAL
========================= */

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
    authViews.forEach((item) => item?.classList.remove('active'));
    view?.classList.add('active');

    if (registerError) registerError.textContent = '';
    if (resetError) resetError.textContent = '';
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
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  showRegister?.addEventListener('click', () => showAuthView(registerView));
  showSignin?.addEventListener('click', () => showAuthView(signinView));
  showForgot?.addEventListener('click', () => showAuthView(forgotView));
  forgotBackSignin?.addEventListener('click', () => showAuthView(signinView));
  otpBack?.addEventListener('click', () => showAuthView(forgotView));
  resetBackSignin?.addEventListener('click', () => showAuthView(signinView));

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

    if (registerError) registerError.textContent = '';

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
    showAuthView(otpView);
  });

  otpForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    showAuthView(resetView);
  });

  resetForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');

    if (!newPassword || !confirmNewPassword) return;

    if (newPassword.value !== confirmNewPassword.value) {
      if (resetError) resetError.textContent = 'Passwords do not match.';
      confirmNewPassword.focus();
      return;
    }

    if (resetError) resetError.textContent = '';

    console.log('Password reset ready for Django backend.');

    resetForm.reset();
    showAuthView(signinView);
  });
}


/* =========================
   LOAD AUTH MODAL
========================= */

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


/* =========================
   VEHICLE BOOKING FLOW
   RENT A CAR + SELF DRIVE
========================= */

function initVehicleBooking() {
  const rentButton = document.querySelector('#rentForm .find-vehicle-btn');
  const selfDriveButton = document.querySelector('#selfForm .self-drive-search-btn');

  const modal = document.getElementById('bookingModal');
  const overlay = document.getElementById('bookingModalOverlay');
  const closeButton = document.getElementById('bookingModalClose');
  const vehicleView = document.getElementById('vehicleSelectionView');
  const bookingView = document.getElementById('bookingDetailsView');
  const results = document.getElementById('vehicleResults');
  const bookingForm = document.getElementById('bookingForm');
  const backButton = document.getElementById('bookingBackBtn');

  if (!modal || !vehicleView || !bookingView || !results || !bookingForm) {
    return;
  }

  let availableVehicles = [];
  let selectedVehicle = null;
  let currentTrip = null;
  let currentRentalType = 'rental';

  function getRentTrip() {
    return {
      pickupLocation: document.getElementById('pickupLocation')?.value.trim() || '',
      dropoffLocation: document.getElementById('dropoffLocation')?.value.trim() || '',
      pickupDate: document.getElementById('pickupDateTime')?.value || '',
      returnDate: document.getElementById('dropDateTime')?.value || ''
    };
  }

  function getSelfDriveTrip() {
    return {
      pickupLocation: document.getElementById('selfPickupLocation')?.value.trim() || '',
      dropoffLocation: document.getElementById('selfDropoffLocation')?.value.trim() || '',
      pickupDate: document.getElementById('selfPickupDateTime')?.value || '',
      returnDate: document.getElementById('selfDropDateTime')?.value || ''
    };
  }

  function validateTrip(trip) {
    if (
      !trip.pickupLocation ||
      !trip.dropoffLocation ||
      !trip.pickupDate ||
      !trip.returnDate
    ) {
      alert('Please complete all trip details first.');
      return false;
    }

    const pickup = new Date(trip.pickupDate);
    const returnTime = new Date(trip.returnDate);

    if (
      Number.isNaN(pickup.getTime()) ||
      Number.isNaN(returnTime.getTime())
    ) {
      alert('Please enter valid pickup and drop dates.');
      return false;
    }

    if (returnTime <= pickup) {
      alert('Drop date must be after pickup date.');
      return false;
    }

    return true;
  }

  function openModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';

    vehicleView.style.display = 'block';
    bookingView.style.display = 'none';

    selectedVehicle = null;
    currentTrip = null;
    currentRentalType = 'rental';
  }

  function showVehicleView() {
    vehicleView.style.display = 'block';
    bookingView.style.display = 'none';
  }

  function showBookingView() {
    vehicleView.style.display = 'none';
    bookingView.style.display = 'block';
  }

  function renderVehicles(vehicles) {
    results.innerHTML = '';

    if (!vehicles.length) {
      results.innerHTML = `
        <div class="vehicle-message">
          No vehicles are available for the selected dates.
        </div>
      `;
      return;
    }

    vehicles.forEach((vehicle) => {
      const imageUrl = vehicle.image
        ? `http://127.0.0.1:8000${vehicle.image}`
        : '';

      const card = document.createElement('article');
      card.className = 'vehicle-card';

      card.innerHTML = `
        <div class="vehicle-card-image">
          ${
            imageUrl
              ? `<img src="${imageUrl}" alt="${vehicle.name}">`
              : `
                <div class="vehicle-image-placeholder">
                  <i class="bi bi-car-front"></i>
                </div>
              `
          }
        </div>

        <div class="vehicle-card-body">
          <span class="vehicle-card-type">${vehicle.vehicle_type}</span>
          <h3>${vehicle.name}</h3>

          <div class="vehicle-details">
            <span>
              <i class="bi bi-people"></i>
              ${vehicle.seats} Seats
            </span>

            <span>
              <i class="bi bi-gear"></i>
              ${vehicle.transmission}
            </span>

            <span>
              <i class="bi bi-fuel-pump"></i>
              ${vehicle.fuel_type}
            </span>
          </div>

          <div class="vehicle-card-footer">
            <div class="vehicle-price">
              <strong>
                Rs. ${Number(vehicle.price_per_day).toLocaleString()}
              </strong>
              <small>per day</small>
            </div>

            <button
              type="button"
              class="select-vehicle-btn"
              data-vehicle-id="${vehicle.id}"
            >
              Select Vehicle
            </button>
          </div>
        </div>
      `;

      results.appendChild(card);
    });
  }

  async function findVehicles(trip, rentalType, button) {
    if (!validateTrip(trip)) return;

    currentTrip = trip;
    currentRentalType = rentalType;
    selectedVehicle = null;

    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = 'Finding Vehicles...';

    try {
      const query = new URLSearchParams({
        pickup: trip.pickupDate,
        return: trip.returnDate
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/vehicles/?${query.toString()}`
      );

      if (!response.ok) {
        throw new Error('Unable to load vehicles.');
      }

      const data = await response.json();

      availableVehicles = data.vehicles || [];

      renderVehicles(availableVehicles);
      showVehicleView();
      openModal();
    } catch (error) {
      console.error('Vehicle error:', error);

      alert(
        'Unable to load vehicles. Please make sure the backend is running.'
      );
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  /* RENT A CAR */
  rentButton?.addEventListener('click', () => {
    const trip = getRentTrip();

    findVehicles(
      trip,
      'rental',
      rentButton
    );
  });

  /* SELF DRIVE */
  selfDriveButton?.addEventListener('click', () => {
    const trip = getSelfDriveTrip();

    findVehicles(
      trip,
      'self_drive',
      selfDriveButton
    );
  });

  /* SELECT VEHICLE */
  results.addEventListener('click', (event) => {
    const button = event.target.closest('.select-vehicle-btn');

    if (!button) return;

    const vehicleId = Number(button.dataset.vehicleId);

    selectedVehicle = availableVehicles.find(
      (vehicle) => vehicle.id === vehicleId
    );

    if (!selectedVehicle || !currentTrip) return;

    if (!validateTrip(currentTrip)) {
      closeModal();
      return;
    }

    const pickup = new Date(currentTrip.pickupDate);
    const returnTime = new Date(currentTrip.returnDate);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const rentalDays = Math.max(
      1,
      Math.ceil(
        (returnTime - pickup) /
        millisecondsPerDay
      )
    );

    const total =
      rentalDays *
      Number(selectedVehicle.price_per_day);

    document.getElementById('bookingVehicleId').value =
      selectedVehicle.id;

    document.getElementById('bookingVehicleName').textContent =
      selectedVehicle.name;

    document.getElementById('bookingPickupSummary').textContent =
      currentTrip.pickupLocation;

    document.getElementById('bookingDropoffSummary').textContent =
      currentTrip.dropoffLocation;

    document.getElementById('bookingDateSummary').textContent =
      `${rentalDays} day${rentalDays > 1 ? 's' : ''}`;

    document.getElementById('bookingPriceSummary').textContent =
      `Rs. ${total.toLocaleString()}`;

    const modalLabel =
      bookingView.querySelector('.booking-modal-header span');

    if (modalLabel) {
      modalLabel.textContent =
        currentRentalType === 'self_drive'
          ? 'Complete Your Self Drive Booking'
          : 'Complete Your Booking';
    }

    const message =
      document.getElementById('bookingMessage');

    message.className = 'booking-message';
    message.textContent = '';

    showBookingView();
  });

  /* BACK / CLOSE */
  backButton?.addEventListener('click', showVehicleView);
  closeButton?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      modal.classList.contains('show')
    ) {
      closeModal();
    }
  });

  /* SUBMIT BOOKING */
  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!selectedVehicle || !currentTrip) return;
    if (!validateTrip(currentTrip)) return;

    const fullName =
      document.getElementById('bookingFullName').value.trim();

    const email =
      document.getElementById('bookingEmail').value.trim();

    const phone =
      document.getElementById('bookingPhone').value.trim();

    const notes =
      document.getElementById('bookingNotes').value.trim();

    const message =
      document.getElementById('bookingMessage');

    const submitButton =
      bookingForm.querySelector('.booking-submit-btn');

    message.className = 'booking-message error';

    if (!fullName) {
      message.textContent = 'Please enter your full name.';
      return;
    }

    if (!email) {
      message.textContent = 'Please enter your email address.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      message.textContent = 'Please enter a valid email address.';
      return;
    }

    if (!phone) {
      message.textContent = 'Please enter your phone number.';
      return;
    }

    const phonePattern = /^[0-9+\-\s()]{7,20}$/;

    if (!phonePattern.test(phone)) {
      message.textContent = 'Please enter a valid phone number.';
      return;
    }

    message.className = 'booking-message';
    message.textContent = '';

    const bookingData = {
      vehicle_id: selectedVehicle.id,
      rental_type: currentRentalType,
      full_name: fullName,
      email,
      phone,
      pickup_location: currentTrip.pickupLocation,
      dropoff_location: currentTrip.dropoffLocation,
      pickup_datetime: currentTrip.pickupDate,
      return_datetime: currentTrip.returnDate,
      notes
    };

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/bookings/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          'Unable to submit booking.'
        );
      }

      message.className =
        'booking-message success';

      if (currentRentalType === 'self_drive') {
        message.textContent =
          `Self Drive booking submitted successfully. Booking #${data.booking_id}. Total: Rs. ${Number(data.total_price).toLocaleString()}`;
      } else {
        message.textContent =
          `Booking submitted successfully. Booking #${data.booking_id}. Total: Rs. ${Number(data.total_price).toLocaleString()}`;
      }

      document.getElementById('bookingFullName').value = '';
      document.getElementById('bookingEmail').value = '';
      document.getElementById('bookingPhone').value = '';
      document.getElementById('bookingNotes').value = '';

    } catch (error) {
      console.error('Booking error:', error);

      message.className =
        'booking-message error';

      message.textContent =
        error.message;

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Booking';
    }
  });
}

document.addEventListener(
  'DOMContentLoaded',
  initVehicleBooking
);


/* =========================
   DRIVER REQUEST FLOW
========================= */

function initDriverRequest() {
  const findButton =
    document.querySelector('.driver-search-btn');

  const modal =
    document.getElementById('driverRequestModal');

  const overlay =
    document.getElementById('driverRequestOverlay');

  const closeButton =
    document.getElementById('driverRequestClose');

  const form =
    document.getElementById('driverRequestForm');

  const message =
    document.getElementById('driverRequestMessage');

  if (!findButton || !modal || !form) return;

  let trip = null;

  function getDriverTrip() {
    return {
      pickupLocation:
        document.getElementById('driverPickupLocation')?.value.trim() || '',

      dropoffLocation:
        document.getElementById('driverDropoffLocation')?.value.trim() || '',

      pickupDate:
        document.getElementById('driverPickupDateTime')?.value || '',

      returnDate:
        document.getElementById('driverDropDateTime')?.value || '',

      vehicleType:
        document.getElementById('driverVehicleType')?.value || ''
    };
  }

  function validateDriverTrip(data) {
    if (
      !data.pickupLocation ||
      !data.dropoffLocation ||
      !data.pickupDate ||
      !data.returnDate ||
      !data.vehicleType
    ) {
      alert('Please complete all driver trip details.');
      return false;
    }

    const pickup = new Date(data.pickupDate);
    const returnTime = new Date(data.returnDate);

    if (
      Number.isNaN(pickup.getTime()) ||
      Number.isNaN(returnTime.getTime())
    ) {
      alert('Please enter valid pickup and drop dates.');
      return false;
    }

    if (returnTime <= pickup) {
      alert('Drop date must be after pickup date.');
      return false;
    }

    return true;
  }

  function openModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  findButton.addEventListener('click', () => {
    trip = getDriverTrip();

    if (!validateDriverTrip(trip)) return;

    const pickup = new Date(trip.pickupDate);
    const returnTime = new Date(trip.returnDate);
    const vehicleSelect =
      document.getElementById('driverVehicleType');

    document.getElementById('driverPickupSummary').textContent =
      trip.pickupLocation;

    document.getElementById('driverDropoffSummary').textContent =
      trip.dropoffLocation;

    document.getElementById('driverDateSummary').textContent =
      `${pickup.toLocaleString()} → ${returnTime.toLocaleString()}`;

    document.getElementById('driverVehicleSummary').textContent =
      vehicleSelect.options[
        vehicleSelect.selectedIndex
      ].text;

    message.className = 'booking-message';
    message.textContent = '';

    openModal();
  });

  closeButton?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      modal.classList.contains('show')
    ) {
      closeModal();
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!trip || !validateDriverTrip(trip)) return;

    const fullName =
      document.getElementById('driverFullName').value.trim();

    const email =
      document.getElementById('driverEmail').value.trim();

    const phone =
      document.getElementById('driverPhone').value.trim();

    const notes =
      document.getElementById('driverNotes').value.trim();

    const submitButton =
      form.querySelector('.booking-submit-btn');

    message.className = 'booking-message error';

    if (!fullName) {
      message.textContent = 'Please enter your full name.';
      return;
    }

    if (!email) {
      message.textContent = 'Please enter your email address.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      message.textContent = 'Please enter a valid email address.';
      return;
    }

    if (!phone) {
      message.textContent = 'Please enter your phone number.';
      return;
    }

    const phonePattern = /^[0-9+\-\s()]{7,20}$/;

    if (!phonePattern.test(phone)) {
      message.textContent = 'Please enter a valid phone number.';
      return;
    }

    message.className = 'booking-message';
    message.textContent = '';

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/driver-requests/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            full_name: fullName,
            email,
            phone,
            pickup_location: trip.pickupLocation,
            dropoff_location: trip.dropoffLocation,
            pickup_datetime: trip.pickupDate,
            return_datetime: trip.returnDate,
            vehicle_type: trip.vehicleType,
            notes
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          'Unable to submit driver request.'
        );
      }

      message.className =
        'booking-message success';

      message.textContent =
        `Driver request submitted successfully. Request #${data.request_id}.`;

      form.reset();

    } catch (error) {
      console.error(
        'Driver request error:',
        error
      );

      message.className =
        'booking-message error';

      message.textContent =
        error.message;

    } finally {
      submitButton.disabled = false;
      submitButton.textContent =
        'Submit Driver Request';
    }
  });
}

document.addEventListener(
  'DOMContentLoaded',
  initDriverRequest
);