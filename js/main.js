const serviceOptions = document.querySelectorAll('.service-option');

serviceOptions.forEach((option) => {

  option.addEventListener('click', () => {

    serviceOptions.forEach((item) => {
      item.classList.remove('active');
    });

    option.classList.add('active');

  });

});