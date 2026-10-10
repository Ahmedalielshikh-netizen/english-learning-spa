document.addEventListener("DOMContentLoaded", () => {
  const state = {
    activeLevel: "A1",
    activeTrack: "lessons",
    page: 1,
    pageSize: 9,
    query: ""
  };

  const TRACK_DEFS = [
    {
      key: "lessons",
      label: "Lessons",
      icon: "📚",
      badge: "Core track",
      description: "Structured lessons that build speaking, reading, and writing confidence over time."
    },
    {
      key: "grammar",
      label: "Grammar",
      icon: "✍️",
      badge: "Rule mastery",
      description: "Clear explanations and guided patterns for high-frequency sentence structures."
    },
    {
      key: "vocabulary",
      label: "Vocabulary",
      icon: "🗣️",
      badge: "Word power",
      description: "Theme-based word clusters for practical conversation and strong retention."
    },
    {
      key: "quizzes",
      label: "Quizzes",
      icon: "⏱️",
      badge: "Check your level",
      description: "Rapid knowledge checks with instant feedback, scoring, and review loops."
    }
  ];

  const levelSelect = document.getElementById("level-select");
  const trackGrid = document.getElementById("track-grid");
  const contentArea = document.getElementById("content-area");
  const searchInput = document.getElementById("search-input");
  const panelTitle = document.getElementById("panel-title");
  const modal = document.getElementById("quiz-modal");

  function getLevelData() {
    return window.curriculum.levels[state.activeLevel];
  }

  function formatLabel(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function bindEvents() {
    levelSelect.addEventListener("change", (event) => {
      state.activeLevel = event.target.value;
      state.page = 1;
      render();
    });

    searchInput.addEventListener("input", (event) => {
      state.query = event.target.value.trim().toLowerCase();
      state.page = 1;
      renderContent();
    });

    trackGrid.addEventListener("click", (event) => {
      const card = event.target.closest(".track-card");
      if (!card) return;
      state.activeTrack = card.dataset.track;
      state.page = 1;
      render();
    });

    contentArea.addEventListener("click", (event) => {
      const pageButton = event.target.closest(".page-button");
      if (pageButton) {
        state.page = Number(pageButton.dataset.page);
        renderContent();
        return;
      }

      const launchButton = event.target.closest("[data-quiz-launch]");
      if (launchButton) {
        const quizIndex = Number(launchButton.dataset.quizLaunch);
        const quizSet = getLevelData().quizzes[quizIndex];
        if (quizSet) {
          window.QuizEngine.open(quizSet);
        }
        return;
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal && !modal.classList.contains("hidden")) {
        if (window.QuizEngine && typeof window.QuizEngine.close === "function") {
          window.QuizEngine.close();
        }
      }
    });
  }

  function populateLevels() {
    const currentValue = state.activeLevel;
    levelSelect.value = currentValue;
  }

  function renderTrackGrid() {
    const activeLevel = getLevelData();

    trackGrid.innerHTML = TRACK_DEFS.map((track) => {
      const itemCount = activeLevel[track.key].length;
      const isActive = state.activeTrack === track.key;

      return `
        <article class="track-card ${isActive ? "active" : ""}" data-track="${track.key}">
          <div class="track-top">
            <div class="track-icon">${track.icon}</div>
            <span class="track-tag">${track.badge}</span>
          </div>

          <div class="track-meta">
            <h3>${track.label}</h3>
            <div class="track-count">${itemCount.toLocaleString()}</div>
            <small>${activeLevel.meta.title}</small>
          </div>

          <div class="track-body">
            <p>${track.description}</p>
          </div>

          <div class="track-footer">
            <span class="track-tag">${track.key}</span>
            <span class="track-arrow">→</span>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderContent() {
    const levelData = getLevelData();
    const trackItems = levelData[state.activeTrack];
    const searchTerm = state.query;

    panelTitle.textContent = formatLabel(state.activeTrack);

    let filtered = trackItems;

    if (searchTerm) {
      filtered = trackItems.filter((item) => {
        const haystack = [
          item.title,
          item.topic,
          item.rule,
          item.cluster,
          item.term,
          item.description,
          item.objective,
          item.focus,
          item.example,
          item.prompt,
          item.title
        ].join(" ").toLowerCase();

        return haystack.includes(searchTerm);
      });
    }

    const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;

    const offset = (state.page - 1) * state.pageSize;
    const paginatedItems = filtered.slice(offset, offset + state.pageSize);

    if (!paginatedItems.length) {
      contentArea.innerHTML = `
        <div class="empty-state">
          <div>
            <strong>No content found</strong>
            <span>Try a different keyword or switch to another proficiency level.</span>
          </div>
        </div>
      `;
      return;
    }

    let cardsHtml = "";

    if (state.activeTrack === "lessons") {
      cardsHtml = paginatedItems.map((item) => `
        <article class="lesson-card">
          <div class="card-header">
            <span class="card-badge">Lesson</span>
            <span class="level-pill">${state.activeLevel}</span>
          </div>

          <div>
            <h3>${item.title}</h3>
          </div>

          <p>${item.description}</p>

          <div class="lesson-meta">
            <span>⏱ ${item.duration} min</span>
            <span>${item.difficulty}</span>
          </div>

          <button class="card-action" type="button">Open lesson →</button>
        </article>
      `).join("");
    }

    if (state.activeTrack === "grammar") {
      cardsHtml = paginatedItems.map((item) => `
        <article class="grammar-card">
          <div class="card-header">
            <span class="card-badge">Grammar</span>
            <span class="level-pill">${state.activeLevel}</span>
          </div>

          <h3>${item.title}</h3>

          <p>${item.explanation}</p>

          <div class="grammar-meta">
            <span>${item.rule}</span>
            <span>${item.difficulty}</span>
          </div>

          <button class="card-action" type="button">Review rule →</button>
        </article>
      `).join("");
    }

    if (state.activeTrack === "vocabulary") {
      cardsHtml = paginatedItems.map((item) => `
        <article class="vocab-card">
          <div class="card-header">
            <span class="card-badge">Vocabulary</span>
            <span class="level-pill">${state.activeLevel}</span>
          </div>

          <h3>${item.title}</h3>

          <p>${item.example}</p>

          <div class="vocab-meta">
            <span>${item.cluster}</span>
            <span>${item.difficulty}</span>
          </div>

          <button class="card-action" type="button">Study terms →</button>
        </article>
      `).join("");
    }

    if (state.activeTrack === "quizzes") {
      cardsHtml = paginatedItems.map((item, index) => `
        <article class="quiz-card">
          <div class="card-header">
            <span class="card-badge">Quiz</span>
            <span class="level-pill">${state.activeLevel}</span>
          </div>

          <h3>${item.title}</h3>

          <p>${item.context}</p>

          <div class="quiz-meta">
            <span>${item.difficulty}</span>
            <span>${item.choices.length} questions</span>
          </div>

          <button class="primary-button" type="button" data-quiz-launch="${(state.page - 1) * state.pageSize + index}">
            Start quiz
          </button>
        </article>
      `).join("");
    }

    const pageButtons = Array.from({ length: totalPages }, (_, index) => {
      const pageNumber = index + 1;
      const isActive = pageNumber === state.page;
      return `
        <button class="page-button ${isActive ? "active" : ""}" type="button" data-page="${pageNumber}">
          ${pageNumber}
        </button>
      `;
    }).join("");

    contentArea.innerHTML = `
      <div class="card-grid">
        ${cardsHtml}
      </div>

      <div class="pagination">
        ${pageButtons}
      </div>
    `;
  }

  function render() {
    populateLevels();
    renderTrackGrid();
    renderContent();
  }

  bindEvents();
  render();
});
