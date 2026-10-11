(() => {
  const storageKey = 'vc-ensinos-theme';
  const root = document.documentElement;
  const storedTheme = localStorage.getItem(storageKey);
  const initialTheme = storedTheme === 'light' || storedTheme === 'dark'
    ? storedTheme
    : 'dark';

  root.dataset.theme = initialTheme;

  const updateButtons = (theme) => {
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      const label = nextTheme === 'light' ? 'Ativar tema claro' : 'Ativar tema escuro';
      const icon = button.querySelector('[data-theme-icon]');
      const text = button.querySelector('[data-theme-label]');

      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', String(theme === 'light'));

      if (icon) {
        icon.classList.toggle('fa-sun', nextTheme === 'light');
        icon.classList.toggle('fa-moon', nextTheme === 'dark');
      }

      if (text) {
        text.textContent = nextTheme === 'light' ? 'Claro' : 'Escuro';
      }
    });
  };

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem(storageKey, theme);
    updateButtons(theme);
  };

  document.addEventListener('DOMContentLoaded', () => {
    updateButtons(root.dataset.theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
      });
    });
  });

  window.addEventListener('storage', (event) => {
    if (event.key === storageKey && (event.newValue === 'light' || event.newValue === 'dark')) {
      root.dataset.theme = event.newValue;
      updateButtons(event.newValue);
    }
  });
})();
