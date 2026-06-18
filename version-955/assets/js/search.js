document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('[data-search-form]');
    var input = form ? form.querySelector('input[name="q"]') : null;
    var results = document.querySelector('[data-search-results]');
    var title = document.querySelector('[data-search-title]');
    var empty = document.querySelector('[data-search-empty]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char];
        });
    }

    function card(movie) {
        var tags = (movie.tags || []).slice(0, 4).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        return '<article class="movie-card" data-title="' + escapeHtml(movie.title) + '">' +
            '<a href="' + escapeHtml(movie.url) + '" title="' + escapeHtml(movie.title) + ' 在线观看">' +
                '<div class="poster-frame">' +
                    '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" onerror="this.remove()">' +
                    '<span class="play-dot">▶</span>' +
                    '<span class="year-badge">' + escapeHtml(movie.year) + '</span>' +
                '</div>' +
                '<div class="movie-card-body">' +
                    '<h3>' + escapeHtml(movie.title) + '</h3>' +
                    '<p>' + escapeHtml(movie.oneLine) + '</p>' +
                    '<div class="movie-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
                    '<div class="tag-row">' + tags + '</div>' +
                '</div>' +
            '</a>' +
        '</article>';
    }

    function normalize(value) {
        return String(value || '').toLowerCase();
    }

    function search(query) {
        var q = normalize(query).trim();
        if (!results) {
            return;
        }

        if (!q) {
            return;
        }

        var matched = CATALOG_ITEMS.filter(function (movie) {
            var text = [
                movie.title,
                movie.year,
                movie.region,
                movie.type,
                movie.genre,
                movie.oneLine,
                (movie.tags || []).join(' ')
            ].join(' ');
            return normalize(text).indexOf(q) >= 0;
        });

        results.innerHTML = matched.map(card).join('');

        if (title) {
            title.textContent = '搜索结果：' + query;
        }

        if (empty) {
            empty.classList.toggle('show', matched.length === 0);
        }
    }

    if (input && initial) {
        input.value = initial;
        search(initial);
    }

    if (form && input) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var value = input.value.trim();
            if (value) {
                history.replaceState(null, '', 'search.html?q=' + encodeURIComponent(value));
                search(value);
            }
        });
    }
});
