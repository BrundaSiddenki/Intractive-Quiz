window.onload = () => {
  const quizData = [
    {
      question: "What does CSS stand for?",
      options: ["Creative Style Sheet", "Cascading Style Sheet", "Colorful Style Sheet", "Computer Style Sheet"],
      answer: 1
    },
    {
      question: "Which tag is used to link CSS in HTML?",
      options: ["<style>", "<css>", "<script>", "<link>"],
      answer: 3
    },
    {
      question: "Which unit is relative to the root element?",
      options: ["px", "em", "rem", "%"],
      answer: 2
    },
    {
      question: "Which language runs in the browser?",
      options: ["C++", "Java", "JavaScript", "Python"],
      answer: 2
    },
    {
      question: "What does HTML stand for?",
      options: ["Hyper Tool Markup Language", "HyperText Markup Language", "High Text Machine Language", "Hyperlink Text Markdown Language"],
      answer: 1
    },
    {
      question: "Purpose of media queries?",
      options: ["Add media to site", "Write JavaScript", "Apply styles based on device", "Create animations"],
      answer: 2
    },
    {
      question: "What event triggers on button click in JS?",
      options: ["onhover", "onchange", "onsubmit", "onclick"],
      answer: 3
    }
  ];

  const startCard = document.getElementById('start');
  const quizCard = document.getElementById('quiz');
  const resultCard = document.getElementById('result');

  const startBtn = document.getElementById('start-btn');
  const restartBtn = document.getElementById('restart-btn');
  const newJokeBtn = document.getElementById('new-joke-btn');

  const questionEl = document.getElementById('question');
  const answersEl = document.getElementById('answers');
  const feedbackEl = document.getElementById('feedback');
  const questionCountEl = document.getElementById('question-count');
  const progressCircle = document.getElementById('progress-circle');
  const progressText = document.getElementById('progress-text');
  const scoreEl = document.getElementById('score');
  const jokeBox = document.getElementById('joke-box');

  let currentIndex = 0;
  let score = 0;
  const circleCircumference = 2 * Math.PI * 28;

  startBtn.addEventListener('click', startQuiz);
  restartBtn.addEventListener('click', restartQuiz);
  newJokeBtn.addEventListener('click', fetchJoke);

  function startQuiz() {
    currentIndex = 0;
    score = 0;
    updateProgress();
    showCard(quizCard);
    showQuestion();
  }

  function restartQuiz() {
    showCard(startCard);
    feedbackEl.textContent = '';
  }

  function showCard(card) {
    [startCard, quizCard, resultCard].forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  }

  function showQuestion() {
    feedbackEl.textContent = '';
    const currentQ = quizData[currentIndex];
    questionEl.textContent = currentQ.question;
    questionCountEl.textContent = `Question ${currentIndex + 1} / ${quizData.length}`;

    answersEl.innerHTML = '';
    currentQ.options.forEach((option, i) => {
      const btn = document.createElement('button');
      btn.textContent = option;
      btn.className = 'answer-btn';
      btn.onclick = () => selectAnswer(i, btn);
      answersEl.appendChild(btn);
    });
    updateProgress();
  }

  function selectAnswer(selectedIndex, btn) {
    const correctIndex = quizData[currentIndex].answer;
    const buttons = document.querySelectorAll('.answer-btn');

    buttons.forEach(b => {
      b.disabled = true;
      b.classList.add('disabled');
    });

    if (selectedIndex === correctIndex) {
      btn.classList.add('correct');
      feedbackEl.textContent = "🎉 Correct!";
      score++;
    } else {
      btn.classList.add('wrong');
      buttons[correctIndex].classList.add('correct');
      feedbackEl.textContent = "❌ Wrong!";
    }

    currentIndex++;

    setTimeout(() => {
      if (currentIndex < quizData.length) {
        showQuestion();
      } else {
        showResults();
      }
    }, 1500);
  }

  function updateProgress() {
    const progressPercent = (currentIndex / quizData.length) * 100;
    progressText.textContent = `${Math.round(progressPercent)}%`;
    const offset = circleCircumference - (progressPercent / 100) * circleCircumference;
    progressCircle.style.strokeDashoffset = offset;
  }

  function showResults() {
    scoreEl.textContent = `You scored ${score} out of ${quizData.length}!`;
    showCard(resultCard);
    fetchJoke(); // fetch a joke automatically at the end
  }

  function fetchJoke() {
    jokeBox.textContent = "Loading a fun joke... 🤔";

    fetch("https://v2.jokeapi.dev/joke/Any?type=single")
      .then(response => response.json())
      .then(data => {
        if (data && data.joke) {
          jokeBox.textContent = `😂 ${data.joke}`;
        } else {
          jokeBox.textContent = "Couldn't fetch a joke. Try again!";
        }
      })
      .catch(err => {
        console.error(err);
        jokeBox.textContent = "Something went wrong while fetching the joke!";
      });
  }
};
