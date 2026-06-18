(function () {
  const input = document.querySelector('[data-global-search]');
  const results = document.querySelector('.search-results');

  if (!input || !results || !Array.isArray(MOVIE_SEARCH_INDEX)) {
    return;
  }

  const data = MOVIE_SEARCH_INDEX;

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function render(items) {
    if (!items.length) {
      results.innerHTML = '<div class="empty-state">没有找到匹配内容</div>';
      return;
    }

    results.innerHTML = items.slice(0, 80).map(function (item) {
      return '<article class="result-card">' +
        '<a href="./' + escapeHtml(item.url) + '"><img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '"></a>' +
        '<div>' +
        '<h2><a href="./' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h2>' +
        '<p>' + escapeHtml(item.oneLine) + '</p>' +
        '<div class="tag-row"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.genre) + '</span></div>' +
        '</div>' +
        '</article>';
    }).join('');
  }

  function runSearch() {
    const keyword = input.value.trim().toLowerCase();
    const items = keyword
      ? data.filter(function (item) {
          return [item.title, item.year, item.region, item.type, item.genre, item.oneLine, item.category, (item.tags || []).join(' ')]
            .join(' ')
            .toLowerCase()
            .indexOf(keyword) !== -1;
        })
      : data.slice(0, 40);

    render(items);
  }

  input.addEventListener('input', runSearch);
  runSearch();
})();
