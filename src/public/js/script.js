document.addEventListener('DOMContentLoaded', () => {
  const allSearchBtn = document.querySelectorAll('.searchBtn');
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');

  // biome-ignore lint/complexity/noForEach: <explanation>
  allSearchBtn.forEach((btn) => {
    btn.addEventListener('click', function () {
      searchBar.style.visibility = 'visible';
      searchBar.classList.add('open');
      this.setAttribute('aria-expanded', true);
      searchInput.focus();
    });
  });

  searchClose?.addEventListener('click', function () {
    searchBar.style.visibility = 'hidden';
    searchBar.classList.remove('open');
    this.setAttribute('aria-expanded', false);
  });
});
