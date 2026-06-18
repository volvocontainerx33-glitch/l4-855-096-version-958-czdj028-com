(function () {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let current = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  function playSlides() {
    if (slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      window.clearInterval(timer);
      showSlide(index);
      playSlides();
    });
  });

  showSlide(0);
  playSlides();

  const filterInput = document.querySelector('[data-card-filter]');
  const yearFilter = document.querySelector('[data-year-filter]');
  const typeFilter = document.querySelector('[data-type-filter]');
  const cards = Array.from(document.querySelectorAll('.movie-card'));

  function filterCards() {
    const keyword = (filterInput && filterInput.value ? filterInput.value : '').trim().toLowerCase();
    const year = yearFilter && yearFilter.value ? yearFilter.value : '';
    const type = typeFilter && typeFilter.value ? typeFilter.value : '';

    cards.forEach(function (card) {
      const haystack = [
        card.dataset.title,
        card.dataset.genre,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year
      ].join(' ').toLowerCase();
      const matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      const matchedYear = !year || card.dataset.year === year;
      const matchedType = !type || card.dataset.type === type;
      card.style.display = matchedKeyword && matchedYear && matchedType ? '' : 'none';
    });
  }

  [filterInput, yearFilter, typeFilter].forEach(function (node) {
    if (node) {
      node.addEventListener('input', filterCards);
      node.addEventListener('change', filterCards);
    }
  });
})();
