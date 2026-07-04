(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeIcon = document.querySelector("[data-theme-icon]");
  const savedTheme = window.localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "☀" : "◐";
    }
    window.localStorage.setItem("theme", theme);
  }

  setTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
  }

  const cards = Array.from(document.querySelectorAll("[data-card]"));
  const searchInput = document.querySelector("[data-card-search]");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const emptyState = document.querySelector("[data-empty-state]");
  let activeFilter = "all";

  function normalize(value) {
    return value.toLowerCase().replace(/\s+/g, "");
  }

  function filterCards() {
    if (!cards.length) {
      return;
    }

    const query = normalize(searchInput ? searchInput.value : "");
    let visibleCount = 0;

    cards.forEach(function (card) {
      const categories = (card.dataset.category || "").split(/\s+/);
      const text = normalize(card.textContent + " " + (card.dataset.keywords || ""));
      const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);
      const matchesQuery = !query || text.includes(query);
      const shouldShow = matchesFilter && matchesQuery;

      card.hidden = !shouldShow;
      if (shouldShow) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterCards);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.dataset.filter;
      filterButtons.forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      filterCards();
    });
  });

  const copyButtons = Array.from(document.querySelectorAll("[data-copy-target]"));
  copyButtons.forEach(function (button) {
    button.addEventListener("click", async function () {
      const target = document.querySelector(button.dataset.copyTarget);
      if (!target) {
        return;
      }

      try {
        await navigator.clipboard.writeText(target.innerText.trim());
        button.textContent = "已复制";
        window.setTimeout(function () {
          button.textContent = "复制文本";
        }, 1400);
      } catch (error) {
        button.textContent = "复制失败";
      }
    });
  });

  const modal = document.querySelector("[data-modal]");
  const modalOpeners = Array.from(document.querySelectorAll("[data-open-modal]"));
  const modalClosers = Array.from(document.querySelectorAll("[data-close-modal]"));

  function closeModal() {
    if (modal) {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  modalOpeners.forEach(function (button) {
    button.addEventListener("click", function () {
      if (modal) {
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
      }
    });
  });

  modalClosers.forEach(function (button) {
    button.addEventListener("click", closeModal);
  });

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeModal();
      }
    });
  }
})();
