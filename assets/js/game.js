const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const timerElement = document.getElementById("timerCount");
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
var loseSound = new Audio("assets/sounds/Quack.mp3");
var winSound = new Audio("assets/sounds/Clink.mp3");

var timerInterval;
var timerCount = 60;

let questions = [
    {
    question: "How long does a customer have to add AppleCare+ after they purchase a new iPhone?",
    choice1: "90 Days",
    choice2: "70 Days",
    choice3: "60 Days",
    choice4: "40 Days",
    answer: 3
    },
    {

    question: "Where can you purchase AppleCare+?",
    choice1: "Online",
    choice2: "By Phone",
    choice3: "In Store",
    choice4: "All of the above",
    answer: 4
    },
    {
    question: "When was AppleCare+ for Mac introduced?",
    choice1: "2016",
    choice2: "2017",
    choice3: "2018",
    choice4: "2019",
    answer: 2
    },
    {
    question: "What's the most expensive AppleCare+ plan we offer?",
    choice1: "Monthly",
    choice2: "Mac",
    choice3: "Apple Display",
    choice4: "Theft & Loss",
    answer: 1
    },
    {
    question: "Which one isn't an example of AppleCare for Enterprise Support?",
    choice1: "24/7 Support",
    choice2: "Flexible Service Options",
    choice3: "AppleCare Account Manager",
    choice4: "Repair 100% of all iOS Devices",
    answer: 4
  }
];

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
  questionCounter = 0;
  score = 0;
  timerInterval = setInterval(timer, 1000);
  availableQuesions = [...questions];
  getNewQuestion();
};

timer = () => {
  timerCount--;
  if (timerCount === 0) {
    clearInterval(timerInterval);
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("end.html");
  } else {
    timerElement.textContent = timerCount;
  }
};

getNewQuestion = () => {
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    clearInterval(timerInterval);
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach(choice => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      timerCount = timerCount + 5;
      incrementScore(CORRECT_BONUS);
      winSound.play();
    } else {
      timerCount = timerCount - 10;
      loseSound.play();
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};

startGame();

