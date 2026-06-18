document.addEventListener("DOMContentLoaded", function () {
  var navButton = document.querySelector("[data-nav-toggle]");
  var navLinks = document.querySelector("[data-nav-links]");

  if (navButton && navLinks) {
    navButton.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  var carousel = document.querySelector("[data-hero-carousel]");

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    var prev = carousel.querySelector("[data-hero-prev]");
    var next = carousel.querySelector("[data-hero-next]");
    var active = 0;
    var timer = null;

    function showSlide(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")));
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(active - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(active + 1);
        startTimer();
      });
    }

    startTimer();
  }

  var search = document.querySelector("[data-search]");
  var filter = document.querySelector("[data-filter-field]");
  var sort = document.querySelector("[data-sort]");
  var list = document.querySelector("[data-card-list]");

  if (list) {
    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-movie-card]"));
    var original = cards.slice();

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function cardText(card) {
      return [
        card.getAttribute("data-title"),
        card.getAttribute("data-year"),
        card.getAttribute("data-type"),
        card.getAttribute("data-region"),
        card.getAttribute("data-category"),
        card.getAttribute("data-genre"),
        card.textContent
      ].join(" ").toLowerCase();
    }

    function applyFilters() {
      var keyword = normalize(search ? search.value : "");
      var type = normalize(filter ? filter.value : "");

      cards.forEach(function (card) {
        var matchesKeyword = !keyword || cardText(card).indexOf(keyword) !== -1;
        var matchesType = !type || normalize(card.getAttribute("data-type")) === type;
        card.classList.toggle("is-hidden", !(matchesKeyword && matchesType));
      });
    }

    function applySort() {
      var mode = sort ? sort.value : "default";
      var nextCards = original.slice();

      if (mode === "title") {
        nextCards.sort(function (a, b) {
          return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "zh-Hans-CN");
        });
      }

      if (mode === "year") {
        nextCards.sort(function (a, b) {
          return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
        });
      }

      nextCards.forEach(function (card) {
        list.appendChild(card);
      });
      cards = nextCards;
      applyFilters();
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q");

    if (initialQuery && search) {
      search.value = initialQuery;
    }

    if (search) {
      search.addEventListener("input", applyFilters);
    }

    if (filter) {
      filter.addEventListener("change", applyFilters);
    }

    if (sort) {
      sort.addEventListener("change", applySort);
    }

    applyFilters();
  }
});
