(function () {
  const QuizEngine = {
    currentQuiz: null,
    currentAnswers: [],
    score: 0,
    maxScore: 0,
    modal: null,
    content: null,
    closeButton: null,
    initialized: false,
    init() {
      if (this.initialized) return;
      this.modal = document.getElementById("quiz-modal");
      this.content = document.getElementById("quiz-content");
      this.closeButton = document.getElementById("close-quiz-modal");

      if (this.closeButton) {
        this.closeButton.addEventListener("click", () => this.close());
      }

      this.modal?.addEventListener("click", (event) => {
        if (event.target.dataset.closeModal === "true") {
          this.close();
        }
      });

      this.initialized = true;
    },

    open(quizSet) {
      this.init();
      this.currentQuiz = quizSet;
      this.currentAnswers = new Array(quizSet.choices.length).fill(null);
      this.maxScore = Array.isArray(quizSet.choices) ? quizSet.choices.length : 0;
      this.render();
      this.modal.classList.remove("hidden");
      this.modal.setAttribute("aria-hidden", "false");
    },

    close() {
      if (!this.modal) return;
      this.modal.classList.add("hidden");
      this.modal.setAttribute("aria-hidden", "true");
      this.content.innerHTML = "";
    },

    render() {
      if (!this.currentQuiz || !this.content) return;

      const quiz = this.currentQuiz;
      const questionCount = Array.isArray(quiz.choices) ? quiz.choices.length : 0;

      const scoreBadge = `
        <div class="quiz-score-panel">
          <div>
            <p class="eyebrow">Progress</p>
            <strong>${this.score || 0}/${questionCount}</strong>
          </div>
          <button class="primary-button" type="button" id="submit-quiz">Submit answers</button>
        </div>
      `;

      this.content.innerHTML = `
        <article class="quiz-question">
          <p class="eyebrow">${quiz.level}</p>
          <h4>${quiz.prompt}</h4>
          <p>${quiz.context}</p>
          <div class="quiz-options">
            ${quiz.choices
              .map(
                (choice, index) => `
                  <button
                    class="quiz-option"
                    type="button"
                    data-choice-index="${index}"
                    data-correct="${choice.isCorrect ? "true" : "false"}"
                  >
                    ${choice.text}
                  </button>
                `
              )
              .join("")}
          </div>
        </article>
        ${scoreBadge}
      `;

      this.content.querySelectorAll(".quiz-option").forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.choiceIndex);
          const selection = this.currentQuiz.choices[index];
          const isCorrect = selection && selection.isCorrect;

          if (this.currentAnswers[index] !== null) {
            this.currentAnswers[index] = null;
          } else {
            this.currentAnswers[index] = index;
          }

          this.content.querySelectorAll(".quiz-option").forEach((option) => {
            const optionIndex = Number(option.dataset.choiceIndex);
            const isSelected = this.currentAnswers[optionIndex] === optionIndex;
            option.classList.toggle("selected", isSelected);
            option.classList.remove("correct", "incorrect");
          });

          const selected = this.content.querySelectorAll(".quiz-option.selected");
          selected.forEach((option) => {
            const optionIndex = Number(option.dataset.choiceIndex);
            const isRight = this.currentQuiz.choices[optionIndex].isCorrect;
            option.classList.add(isRight ? "correct" : "incorrect");
          });
        });
      });

      const submitButton = document.getElementById("submit-quiz");
      if (submitButton) {
        submitButton.addEventListener("click", () => {
          this.submit();
        });
      }
    },

    submit() {
      if (!this.currentQuiz) return;

      let correctCount = 0;

      this.currentQuiz.choices.forEach((choice, index) => {
        const selected = this.currentAnswers[index] === index;
        if (choice.isCorrect && selected) correctCount += 1;
      });

      const scoreMessage = `You scored ${correctCount} out of ${this.currentQuiz.choices.length}.`;

      this.content.innerHTML = `
        <div class="quiz-score-panel">
          <div>
            <p class="eyebrow">Final result</p>
            <strong>${scoreMessage}</strong>
          </div>
          <button class="secondary-button" type="button" id="close-result">Close</button>
        </div>

        <article class="quiz-question">
          <h4>Answer review</h4>
          <div class="quiz-options">
            ${this.currentQuiz.choices
              .map((choice, index) => {
                const selected = this.currentAnswers[index] === index;
                const isCorrect = choice.isCorrect;
                const classes = [
                  "quiz-option",
                  selected && isCorrect ? "correct" : "",
                  selected && !isCorrect ? "incorrect" : "",
                  !selected && isCorrect ? "correct" : ""
                ]
                  .filter(Boolean)
                  .join(" ");

                return `<button class="${classes}" type="button" disabled>${choice.text}</button>`;
              })
              .join("")}
          </div>
        </article>
      `;

      const closeResultButton = document.getElementById("close-result");
      if (closeResultButton) {
        closeResultButton.addEventListener("click", () => this.close());
      }
    }
  };

  window.QuizEngine = QuizEngine;
})();
