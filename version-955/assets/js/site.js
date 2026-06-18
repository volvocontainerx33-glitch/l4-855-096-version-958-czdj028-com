document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function activate(index) {
            current = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                activate(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                activate((current + 1) % slides.length);
            }, 5200);
        }
    }

    var filterForm = document.querySelector('[data-catalog-filter]');

    if (filterForm) {
        var keywordInput = filterForm.querySelector('[data-filter-keyword]');
        var yearSelect = filterForm.querySelector('[data-filter-year]');
        var typeSelect = filterForm.querySelector('[data-filter-type]');
        var sortSelect = filterForm.querySelector('[data-sort]');
        var grid = document.querySelector('[data-movie-grid]');
        var empty = document.querySelector('[data-empty-state]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

        function getText(card) {
            return [
                card.getAttribute('data-title'),
                card.getAttribute('data-year'),
                card.getAttribute('data-type'),
                card.getAttribute('data-region'),
                card.getAttribute('data-genre')
            ].join(' ').toLowerCase();
        }

        function applyFilter() {
            var keyword = (keywordInput && keywordInput.value || '').trim().toLowerCase();
            var year = yearSelect && yearSelect.value || '';
            var type = typeSelect && typeSelect.value || '';
            var visible = 0;

            cards.forEach(function (card) {
                var matchKeyword = !keyword || getText(card).indexOf(keyword) >= 0;
                var matchYear = !year || card.getAttribute('data-year') === year;
                var matchType = !type || card.getAttribute('data-type') === type;
                var show = matchKeyword && matchYear && matchType;
                card.hidden = !show;
                if (show) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('show', visible === 0);
            }
        }

        function applySort() {
            if (!grid || !sortSelect) {
                return;
            }

            var mode = sortSelect.value;
            var sorted = cards.slice();

            if (mode === 'year-desc') {
                sorted.sort(function (a, b) {
                    return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
                });
            }

            if (mode === 'title-asc') {
                sorted.sort(function (a, b) {
                    return String(a.getAttribute('data-title')).localeCompare(String(b.getAttribute('data-title')), 'zh-Hans-CN');
                });
            }

            sorted.forEach(function (card) {
                grid.appendChild(card);
            });
            applyFilter();
        }

        [keywordInput, yearSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        if (sortSelect) {
            sortSelect.addEventListener('change', applySort);
        }
    }
});
