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
 await loadSiteSettings();
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

function initCorporateRequest() {
  const form = document.getElementById('partnerForm');

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const companyName =
      document.getElementById('corporateCompanyName').value.trim();

    const contactPerson =
      document.getElementById('corporateContactPerson').value.trim();

    const phone =
      document.getElementById('corporatePhone').value.trim();

    const email =
      document.getElementById('corporateEmail').value.trim();

    const rentalRequirement =
      document.getElementById('corporateRequirement').value.trim();

    const submitButton =
      form.querySelector('button[type="submit"]');

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phonePattern =
      /^[0-9+\-\s()]{7,20}$/;

    if (!companyName) {
      alert('Please enter the company name.');
      return;
    }

    if (!contactPerson) {
      alert('Please enter the contact person name.');
      return;
    }

    if (!phonePattern.test(phone)) {
      alert('Please enter a valid phone number.');
      return;
    }

    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML =
      'Submitting...';

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/corporate-requests/',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            company_name: companyName,
            contact_person: contactPerson,
            phone,
            email,
            rental_requirement:
              rentalRequirement
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          'Unable to submit corporate request.'
        );
      }

      const modalElement =
        document.getElementById('partnerModal');

      const modal =
        bootstrap.Modal.getInstance(
          modalElement
        );

      form.reset();
      modal?.hide();

      alert(
        `Corporate request submitted successfully. Request #${data.request_id}`
      );

    } catch (error) {
      console.error(
        'Corporate request error:',
        error
      );

      alert(error.message);

    } finally {
      submitButton.disabled = false;

      submitButton.innerHTML =
        'Submit Request <i class="bi bi-arrow-right"></i>';
    }
  });
}

document.addEventListener(
  'DOMContentLoaded',
  initCorporateRequest
);
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


// /* =========================
//    AUTH MODAL
// ========================= */

// function initSigninModal() {
//   const modal = document.getElementById('signinModal');
//   const closeButton = document.getElementById('closeSignin');
//   const signinView = document.getElementById('signinView');
//   const registerView = document.getElementById('registerView');
//   const forgotView = document.getElementById('forgotView');
//   const otpView = document.getElementById('otpView');
//   const resetView = document.getElementById('resetView');

//   const showRegister = document.getElementById('showRegister');
//   const showSignin = document.getElementById('showSignin');
//   const showForgot = document.getElementById('showForgot');
//   const forgotBackSignin = document.getElementById('forgotBackSignin');
//   const otpBack = document.getElementById('otpBack');
//   const resetBackSignin = document.getElementById('resetBackSignin');

//   const signinForm = document.getElementById('signinForm');
//   const registerForm = document.getElementById('registerForm');
//   const forgotForm = document.getElementById('forgotForm');
//   const otpForm = document.getElementById('otpForm');
//   const resetForm = document.getElementById('resetForm');

//   const registerPassword = document.getElementById('registerPassword');
//   const confirmPassword = document.getElementById('confirmPassword');
//   const registerError = document.getElementById('registerError');
//   const resetError = document.getElementById('resetError');

//   if (!modal || !signinView) return;

//   const authViews = [
//     signinView,
//     registerView,
//     forgotView,
//     otpView,
//     resetView
//   ];

//   function showAuthView(view) {
//     authViews.forEach((item) => item?.classList.remove('active'));
//     view?.classList.add('active');

//     if (registerError) registerError.textContent = '';
//     if (resetError) resetError.textContent = '';
//   }

//   function openModal() {
//     showAuthView(signinView);
//     modal.classList.add('active');
//     document.body.classList.add('modal-open');
//   }

//   function closeModal() {
//     modal.classList.remove('active');
//     document.body.classList.remove('modal-open');
//   }

//   document.addEventListener('click', (event) => {
//     const signinButton = event.target.closest('.signin-btn');
//     if (!signinButton) return;

//     event.preventDefault();
//     openModal();
//   });

//   closeButton?.addEventListener('click', closeModal);

//   modal.addEventListener('click', (event) => {
//     if (event.target === modal) closeModal();
//   });

//   document.addEventListener('keydown', (event) => {
//     if (event.key === 'Escape' && modal.classList.contains('active')) {
//       closeModal();
//     }
//   });

//   showRegister?.addEventListener('click', () => showAuthView(registerView));
//   showSignin?.addEventListener('click', () => showAuthView(signinView));
//   showForgot?.addEventListener('click', () => showAuthView(forgotView));
//   forgotBackSignin?.addEventListener('click', () => showAuthView(signinView));
//   otpBack?.addEventListener('click', () => showAuthView(forgotView));
//   resetBackSignin?.addEventListener('click', () => showAuthView(signinView));

//   document.querySelectorAll('.password-toggle').forEach((button) => {
//     button.addEventListener('click', () => {
//       const input = document.getElementById(button.dataset.password);
//       if (!input) return;

//       const passwordVisible = input.type === 'text';
//       input.type = passwordVisible ? 'password' : 'text';

//       button.innerHTML = passwordVisible
//         ? '<i class="bi bi-eye"></i>'
//         : '<i class="bi bi-eye-slash"></i>';

//       button.setAttribute(
//         'aria-label',
//         passwordVisible ? 'Show password' : 'Hide password'
//       );
//     });
//   });

//   const otpInputs = document.querySelectorAll('.otp-inputs input');

//   otpInputs.forEach((input, index) => {
//     input.addEventListener('input', () => {
//       input.value = input.value.replace(/\D/g, '');

//       if (input.value && index < otpInputs.length - 1) {
//         otpInputs[index + 1].focus();
//       }
//     });

//     input.addEventListener('keydown', (event) => {
//       if (event.key === 'Backspace' && !input.value && index > 0) {
//         otpInputs[index - 1].focus();
//       }
//     });
//   });

// signinForm?.addEventListener('submit', async (event) => {
//   event.preventDefault();

//   const email = document.getElementById('signinEmail').value.trim();
//   const password = document.getElementById('signinPassword').value;
//   const error = document.getElementById('signinError');
//   const button = signinForm.querySelector('.auth-submit');

//   error.textContent = '';
//   button.disabled = true;
//   button.textContent = 'Signing In...';

//   try {
//     const csrfToken = await getAuthCsrfToken();

//     const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-CSRFToken': csrfToken
//       },
//       body: JSON.stringify({email, password})
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.error || 'Unable to sign in.');

//     signinForm.reset();
//     closeAuthModal();
//     await updateAuthNavbar();
//   } catch (err) {
//     error.textContent = err.message;
//   } finally {
//     button.disabled = false;
//     button.textContent = 'Sign In';
//   }
// });

// registerForm?.addEventListener('submit', async (event) => {
//   event.preventDefault();

//   const firstName = document.getElementById('firstName').value.trim();
//   const lastName = document.getElementById('lastName').value.trim();
//   const phone = document.getElementById('registerPhone').value.trim();
//   const email = document.getElementById('registerEmail').value.trim();
//   const password = document.getElementById('registerPassword').value;
//   const confirmPassword = document.getElementById('confirmPassword').value;
//   const error = document.getElementById('registerError');
//   const button = registerForm.querySelector('.auth-submit');

//   error.textContent = '';

//   if (password !== confirmPassword) {
//     error.textContent = 'Passwords do not match.';
//     return;
//   }

//   button.disabled = true;
//   button.textContent = 'Creating Account...';

//   try {
//     const csrfToken = await getAuthCsrfToken();

//     const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-CSRFToken': csrfToken
//       },
//       body: JSON.stringify({
//         first_name: firstName,
//         last_name: lastName,
//         phone,
//         email,
//         password,
//         confirm_password: confirmPassword
//       })
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.error || 'Unable to create account.');

//     registerForm.reset();
//     closeAuthModal();
//     await updateAuthNavbar();
//   } catch (err) {
//     error.textContent = err.message;
//   } finally {
//     button.disabled = false;
//     button.textContent = 'Create Account';
//   }
// });

//   forgotForm?.addEventListener('submit', (event) => {
//     event.preventDefault();
//     showAuthView(otpView);
//   });

//   otpForm?.addEventListener('submit', (event) => {
//     event.preventDefault();
//     showAuthView(resetView);
//   });

//   resetForm?.addEventListener('submit', (event) => {
//     event.preventDefault();

//     const newPassword = document.getElementById('newPassword');
//     const confirmNewPassword = document.getElementById('confirmNewPassword');

//     if (!newPassword || !confirmNewPassword) return;

//     if (newPassword.value !== confirmNewPassword.value) {
//       if (resetError) resetError.textContent = 'Passwords do not match.';
//       confirmNewPassword.focus();
//       return;
//     }

//     if (resetError) resetError.textContent = '';

//     console.log('Password reset ready for Django backend.');

//     resetForm.reset();
//     showAuthView(signinView);
//   });
// }


// /* =========================
//    LOAD AUTH MODAL
// ========================= */

// async function loadSigninModal() {
//   const container = document.getElementById('signin-modal-container');
//   if (!container) return;

//   try {
//     const response = await fetch('components/signin-modal.html');

//     if (!response.ok) {
//       throw new Error('Could not load auth modal.');
//     }

//     container.innerHTML = await response.text();
//     initSigninModal();
//   } catch (error) {
//     console.error('Could not load auth modal:', error);
//   }
// }

// document.addEventListener('DOMContentLoaded', loadSigninModal);


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

document.addEventListener('DOMContentLoaded',initDriverRequest);
/*BLOGS*/

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadBlogs() {
  const blogGrid = document.getElementById('blogGrid');
  if (!blogGrid) return;

  const recentPosts = document.getElementById('recentPosts');
  const categoriesContainer = document.getElementById('blogCategories');

  try {
    const response = await fetch('http://127.0.0.1:8000/api/blogs/');
    if (!response.ok) throw new Error('Unable to load blogs.');

    const data = await response.json();
    const blogs = data.blogs || [];

    if (!blogs.length) {
      blogGrid.innerHTML = `
        <div class="text-center py-5 w-100">
          <i class="bi bi-journal-text fs-1"></i>
          <h4 class="mt-3">No blog posts yet</h4>
          <p>New articles will appear here soon.</p>
        </div>
      `;

      if (recentPosts) recentPosts.innerHTML = '<p>No recent posts.</p>';
      if (categoriesContainer) categoriesContainer.innerHTML = '<p>No categories yet.</p>';
      return;
    }

    renderBlogCards(blogs);
    renderRecentPosts(blogs);
    renderBlogCategories(blogs);

  } catch (error) {
    console.error('Blog loading error:', error);

    blogGrid.innerHTML = `
      <div class="text-center py-5 w-100">
        <i class="bi bi-exclamation-circle fs-1"></i>
        <h4 class="mt-3">Unable to load blogs</h4>
        <p>Please try again later.</p>
      </div>
    `;

    if (recentPosts) recentPosts.innerHTML = '<p>Unable to load recent posts.</p>';
    if (categoriesContainer) categoriesContainer.innerHTML = '<p>Unable to load categories.</p>';
  }
}

function renderBlogCards(blogs) {
  const blogGrid = document.getElementById('blogGrid');
  if (!blogGrid) return;

  blogGrid.innerHTML = blogs.map((blog) => {
    const date = new Date(blog.published_at);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();

    return `
      <article class="blog-card" data-category="${escapeHtml(blog.category)}">
        <div class="blog-image">
          ${blog.image ? `<img src="${blog.image}" alt="${escapeHtml(blog.title)}">` : ''}
          <div class="blog-date">
            <strong>${day}</strong>
            <span>${month}</span>
          </div>
        </div>

        <div class="blog-card-body">
          <div class="blog-meta">
            <span><i class="bi bi-folder"></i> ${escapeHtml(blog.category)}</span>
            <span><i class="bi bi-clock"></i> ${blog.read_time} min read</span>
          </div>

          <h3>${escapeHtml(blog.title)}</h3>
          <p>${escapeHtml(blog.excerpt)}</p>

            <a href="blog-detail.html?id=${blog.id}" class="blog-read-btn">            Read More
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </article>
    `;
  }).join('');
}

function renderRecentPosts(blogs) {
  const recentPosts = document.getElementById('recentPosts');
  if (!recentPosts) return;

  recentPosts.innerHTML = blogs.slice(0, 4).map((blog) => {
    const date = new Date(blog.published_at);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return `
      <a href="blog-detail.html?id=${blog.id}" class="recent-post" data-blog-id="${blog.id}">
        ${blog.image ? `<img src="${blog.image}" alt="${escapeHtml(blog.title)}">` : ''}
        <div>
          <h5>${escapeHtml(blog.title)}</h5>
          <span><i class="bi bi-calendar3"></i> ${formattedDate}</span>
        </div>
      </a>
    `;
  }).join('');
}

function renderBlogCategories(blogs) {
  const categoriesContainer = document.getElementById('blogCategories');
  if (!categoriesContainer) return;

  const categories = {};

  blogs.forEach((blog) => {
    categories[blog.category] = (categories[blog.category] || 0) + 1;
  });

  categoriesContainer.innerHTML = `
    <a href="#" class="blog-category-filter active" data-category="all">
      All Posts <span>${String(blogs.length).padStart(2, '0')}</span>
    </a>

    ${Object.entries(categories).map(([category, count]) => `
      <a href="#" class="blog-category-filter" data-category="${escapeHtml(category)}">
        ${escapeHtml(category)}
        <span>${String(count).padStart(2, '0')}</span>
      </a>
    `).join('')}
  `;

  categoriesContainer.querySelectorAll('.blog-category-filter').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      const category = link.dataset.category;

      categoriesContainer.querySelectorAll('.blog-category-filter').forEach((item) => {
        item.classList.remove('active');
      });

      link.classList.add('active');

      document.querySelectorAll('.blog-card').forEach((card) => {
        const show = category === 'all' || card.dataset.category === category;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', loadBlogs);
/*BLOG DETAIL */

async function loadBlogDetail() {
  const container = document.getElementById('blogDetail');
  if (!container) return;

  const blogId = new URLSearchParams(window.location.search).get('id');
  const title = document.getElementById('blogDetailTitle');
  const excerpt = document.getElementById('blogDetailExcerpt');

  if (!blogId) {
    container.innerHTML = '<div class="text-center py-5"><h3>Blog not found</h3><a href="blog.html" class="blog-read-btn">Back to Blogs</a></div>';
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/blogs/');
    if (!response.ok) throw new Error('Unable to load blog.');

    const data = await response.json();
    const blog = (data.blogs || []).find((item) => String(item.id) === String(blogId));

    if (!blog) {
      container.innerHTML = '<div class="text-center py-5"><h3>Blog not found</h3><a href="blog.html" class="blog-read-btn">Back to Blogs</a></div>';
      return;
    }

    const date = new Date(blog.published_at);

    document.title = `${blog.title} | CarRental`;
    if (title) title.textContent = blog.title;
    if (excerpt) excerpt.textContent = blog.excerpt;

    container.innerHTML = `
      <article>
        ${blog.image ? `<img src="${blog.image}" alt="${escapeHtml(blog.title)}" style="width:100%;max-height:550px;object-fit:cover;border-radius:18px;">` : ''}

        <div class="blog-meta mt-4 mb-4">
          <span><i class="bi bi-folder"></i> ${escapeHtml(blog.category)}</span>
          <span><i class="bi bi-calendar3"></i> ${date.toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'})}</span>
          <span><i class="bi bi-clock"></i> ${blog.read_time} min read</span>
        </div>

        <div class="blog-article-text">${formatBlogContent(blog.content)}</div>

        <div class="mt-5">
          <a href="blog.html" class="blog-read-btn">
            <i class="bi bi-arrow-left"></i> Back to Blogs
          </a>
        </div>
      </article>
    `;

  } catch (error) {
    console.error('Blog detail error:', error);
    container.innerHTML = '<div class="text-center py-5"><h3>Unable to load this article</h3><p>Please try again later.</p></div>';
  }
}

function formatBlogContent(content) {
  return escapeHtml(content)
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replaceAll('\n', '<br>')}</p>`)
    .join('');
}

document.addEventListener('DOMContentLoaded', loadBlogDetail);
/* CONTACT MESSAGE */

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const formMessage = document.getElementById('contactFormMessage');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const button = form.querySelector('.contact-submit-btn');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+\-\s()]{7,20}$/;

    formMessage.className = 'mt-3 text-danger';

    if (!name) {
      formMessage.textContent = 'Please enter your name.';
      return;
    }

    if (!emailPattern.test(email)) {
      formMessage.textContent = 'Please enter a valid email address.';
      return;
    }

    if (phone && !phonePattern.test(phone)) {
      formMessage.textContent = 'Please enter a valid phone number.';
      return;
    }

    if (!subject) {
      formMessage.textContent = 'Please enter a subject.';
      return;
    }

    if (!message) {
      formMessage.textContent = 'Please enter your message.';
      return;
    }

    button.disabled = true;
    button.innerHTML = 'Sending...';

    try {
      const response = await fetch('http://127.0.0.1:8000/api/contact-messages/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, phone, subject, message})
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to send message.');

      form.reset();
      formMessage.className = 'mt-3 text-success';
      formMessage.textContent = 'Your message has been sent successfully.';
    } catch (error) {
      console.error('Contact message error:', error);
      formMessage.className = 'mt-3 text-danger';
      formMessage.textContent = error.message;
    } finally {
      button.disabled = false;
      button.innerHTML = 'Send Message <i class="bi bi-arrow-right"></i>';
    }
  });
}
document.addEventListener('DOMContentLoaded', initContactForm);
/* SITE SETTINGS */

async function loadSiteSettings() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/site-settings/');
    if (!response.ok) throw new Error('Unable to load site settings.');

    const data = await response.json();

    /* CONTACT PAGE */
    const siteAddress = document.getElementById('siteAddress');
    const sitePhone = document.getElementById('sitePhone');
    const siteEmail = document.getElementById('siteEmail');
    const siteBusinessHours = document.getElementById('siteBusinessHours');
    const mapContainer = document.getElementById('siteMapContainer');
    const mapDescription = document.getElementById('siteMapDescription');

    if (siteAddress) siteAddress.textContent = data.address || 'Location will be added by client';
    if (sitePhone) sitePhone.textContent = data.phone || 'Phone number will be added';
    if (siteEmail) siteEmail.textContent = data.email || 'Email address will be added';
    if (siteBusinessHours) siteBusinessHours.textContent = data.business_hours || 'Business hours will be added';

    if (mapDescription && data.address) {
      mapDescription.textContent = `Visit us at ${data.address}.`;
    }

    if (mapContainer && data.google_map_url) {
      mapContainer.innerHTML = `
        <iframe
          src="${escapeHtml(data.google_map_url)}"
          width="100%"
          height="450"
          style="border:0;"
          allowfullscreen
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin">
        </iframe>
      `;
    }

    /* FOOTER */
    const companyName = document.getElementById('footerCompanyName');
    const copyrightName = document.getElementById('footerCopyrightName');
    const footerAddress = document.getElementById('footerAddress');
    const footerPhone = document.getElementById('footerPhone');
    const footerEmail = document.getElementById('footerEmail');
    const facebook = document.getElementById('footerFacebook');
    const instagram = document.getElementById('footerInstagram');

    if (companyName) companyName.textContent = data.company_name || 'CarRental';
    if (copyrightName) copyrightName.textContent = data.company_name || 'CarRental';
    if (footerAddress) footerAddress.textContent = data.address || 'Location will be added by client';

    if (footerPhone) {
      footerPhone.textContent = data.phone || 'Phone number will be added';
      footerPhone.href = data.phone ? `tel:${data.phone.replace(/[^\d+]/g, '')}` : '#';
    }

    if (footerEmail) {
      footerEmail.textContent = data.email || 'Email address will be added';
      footerEmail.href = data.email ? `mailto:${data.email}` : '#';
    }

    if (facebook) {
      facebook.href = data.facebook_url || '#';
      facebook.style.display = data.facebook_url ? '' : 'none';
    }

    if (instagram) {
      instagram.href = data.instagram_url || '#';
      instagram.style.display = data.instagram_url ? '' : 'none';
    }
  } catch (error) {
    console.error('Site settings error:', error);
  }
}

/* TESTIMONIALS */

async function loadTestimonials() {
  const container = document.getElementById('testimonialList');
  if (!container) return;

  try {
    const response = await fetch('http://127.0.0.1:8000/api/testimonials/');
    if (!response.ok) throw new Error('Unable to load testimonials.');

    const data = await response.json();
    const testimonials = data.testimonials || [];

    if (!testimonials.length) {
      container.innerHTML = `
        <div class="col-12 text-center">
          <p>No testimonials available yet.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = testimonials.map((testimonial) => {
      const rating = Math.max(1, Math.min(5, Number(testimonial.rating) || 5));
      const stars = Array.from({length: 5}, (_, index) =>
        `<i class="bi ${index < rating ? 'bi-star-fill' : 'bi-star'}"></i>`
      ).join('');

      const review = escapeHtml(testimonial.review);
      const isLong = testimonial.review.length > 160;

      return `
        <div class="col-lg-4 col-md-6">
          <div class="testimonial-card">
            <div class="testimonial-stars">${stars}</div>

            <div class="testimonial-review-wrap">
              <p class="testimonial-review-text ${isLong ? 'testimonial-clamped' : ''}">
                ${review}
              </p>

              ${isLong ? `
                <button type="button" class="testimonial-read-more">
                  Read more
                </button>
              ` : ''}
            </div>

            <div class="testimonial-person">
              <h5>${escapeHtml(testimonial.customer_name)}</h5>
              ${testimonial.location ? `<span>${escapeHtml(testimonial.location)}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Testimonial error:', error);

    container.innerHTML = `
      <div class="col-12 text-center">
        <p>Unable to load testimonials.</p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', loadTestimonials);

/* TESTIMONIAL READ MORE */

document.addEventListener('click', (event) => {
  const button = event.target.closest('.testimonial-read-more');
  if (!button) return;

  const review = button.closest('.testimonial-review-wrap')
    ?.querySelector('.testimonial-review-text');

  if (!review) return;

  const expanded = review.classList.toggle('expanded');
  review.classList.toggle('testimonial-clamped', !expanded);
  button.textContent = expanded ? 'Show less' : 'Read more';
});
/* DESTINATIONS */

async function loadDestinations() {
    const container = document.getElementById('destinationList');
    if (!container) return;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/destinations/');
        if (!response.ok) throw new Error('Unable to load destinations.');

        const data = await response.json();
        const destinations = data.destinations || [];

        if (!destinations.length) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p>No destinations available yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = destinations.map((destination) => `
            <div class="col-lg-4 col-md-6">
                <div class="tour-card">
                    <div class="tour-image">
                        <img src="${destination.image}" alt="${escapeHtml(destination.name)}">
                        <div class="tour-price">From Rs. ${Number(destination.starting_price).toLocaleString()}/day</div>
                    </div>
                    <div class="tour-content">
                        <h4>${escapeHtml(destination.name)}</h4>
                        <p>${escapeHtml(destination.description)}</p>
                        <a href="#booking" class="tour-link destination-book-btn" data-destination="${escapeHtml(destination.name)}">Book Now →</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Destination error:', error);
        container.innerHTML = `
            <div class="col-12 text-center">
                <p>Unable to load destinations.</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadDestinations);

/* DESTINATION BOOKING */

document.addEventListener('click', (event) => {
    const button = event.target.closest('.destination-book-btn');
    if (!button) return;

    event.preventDefault();

    const destination = button.dataset.destination;
    const bookingSection = document.getElementById('booking');
    const dropoffInput = document.getElementById('dropoffLocation');
    const pickupInput = document.getElementById('pickupLocation');
    const rentOption = document.querySelector('.service-option[data-service="rent"]');

    if (!destination || !bookingSection || !dropoffInput) return;

    if (rentOption) rentOption.click();

    dropoffInput.value = destination;

    bookingSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    setTimeout(() => {
        pickupInput?.focus();
    }, 500);
});