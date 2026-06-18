(function () {
    var qs = function (selector, root) {
        return (root || document).querySelector(selector);
    };

    var qsa = function (selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    };

    var mobileButton = qs("[data-menu-toggle]");
    var mobilePanel = qs("[data-mobile-panel]");

    if (mobileButton && mobilePanel) {
        mobileButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("open");
            mobileButton.setAttribute("aria-expanded", mobilePanel.classList.contains("open") ? "true" : "false");
        });
    }

    qsa("[data-site-search]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var input = qs("input", form);
            var value = input ? input.value.trim() : "";
            var target = "search.html";
            if (value) {
                target += "?q=" + encodeURIComponent(value);
            }
            window.location.href = target;
        });
    });

    var slides = qsa(".hero-slide");
    var dots = qsa(".hero-dot");
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === current);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            showSlide(i);
        });
    });

    if (slides.length > 1) {
        showSlide(0);
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var filterInput = qs("[data-filter-input]");
    var yearSelect = qs("[data-year-filter]");
    var cards = qsa("[data-card-search]");
    var empty = qs("[data-empty-state]");

    function normalize(value) {
        return String(value || "").toLowerCase();
    }

    function applyFilter() {
        if (!cards.length) {
            return;
        }

        var text = filterInput ? normalize(filterInput.value.trim()) : "";
        var year = yearSelect ? yearSelect.value : "";
        var visible = 0;

        cards.forEach(function (card) {
            var content = normalize(card.getAttribute("data-card-search"));
            var cardYear = card.getAttribute("data-year") || "";
            var matchedText = !text || content.indexOf(text) !== -1;
            var matchedYear = !year || cardYear === year;
            var show = matchedText && matchedYear;
            card.style.display = show ? "" : "none";
            if (show) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle("show", visible === 0);
        }
    }

    if (filterInput) {
        filterInput.addEventListener("input", applyFilter);
    }

    if (yearSelect) {
        yearSelect.addEventListener("change", applyFilter);
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    if (query && filterInput) {
        filterInput.value = query;
        applyFilter();
    }
})();
