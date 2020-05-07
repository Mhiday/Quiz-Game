/**
 * -------------------------------------
 * 
 * application state
 * 
 * -------------------------------------
 */
let appState = {}

/**
 * -------------------------------------
 * 
 * dom elements
 * 
 * -------------------------------------
 */
const nextBtn = document.querySelector('#nextBtn');
const prevBtn = document.querySelector('#prevBtn');
const startFinishBtn = document.querySelector('#submitBtn');
const questionArea = document.querySelector('#questionArea');
const actionArea = document.querySelector('#actionArea');
const quizEnd = document.querySelector('#quizEnd');
const quizEndScore = quizEnd.querySelector('.score');
const options = document.querySelector('#options');
const questionBox = document.querySelector('#question');
const questionLabel = document.querySelector('#currQuestionLabel');
const correctScore = document.querySelector('#correctScore');
const wrongScore = document.querySelector('#wrongScore');
const total = document.querySelector('#total');

/**
 * -------------------------------------
 * 
 * event bindings
 * 
 * -------------------------------------
 */
nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);
startFinishBtn.addEventListener('click', handleStartFinish);

/**
 * -------------------------------------
 * 
 * functions
 * 
 * -------------------------------------
 */
function initApp() {
  appState = {
    current: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    answered: {},
    total: questions.length,
    showQuiz: true,
    showScore: false,
  };
  renderQuestion();
  updateScoreSheet();
}

function next() {
  const current = appState.current;
  
  if (current < questions.length - 1) {
    appState.current = current + 1;
    renderQuestion();
  }
}

function prev() {
  const current = appState.current;
  
  if (current > 0) {
    appState.current = current - 1;
    renderQuestion();
  }
}

function handleStartFinish(e) {
  const buttonText = e.target.innerHTML.toLowerCase();

  console.log(appState.total);
  
  if (buttonText === 'start') {
    e.target.innerHTML = 'finish';
    initApp();
  } else {
    e.target.innerHTML = 'start';
    quizEndScore.innerHTML = `
      ${appState.correctAnswers} / ${appState.total}
    `;
  }

  toggleDisplay();
}

function toggleDisplay() {
  questionArea.classList.toggle('hide');
  quizEnd.classList.toggle('hide');
  actionArea.classList.toggle('hide');
}

function renderQuestion() {
  const q = questions[appState.current];
  const fieldName = `question-${appState.current}`;
  const answer = appState.answered[fieldName];
  const optionsList = generateOptions(fieldName, q.options, answer);
  
  questionBox.innerHTML = q.question;
  options.innerHTML = "";
  options.appendChild(optionsList);
  questionLabel.innerHTML = `${appState.current + 1} of ${questions.length}`;
}

function updateAnswer(e) {
  const selectedOption = e.target;
  const fieldName = e.target.name;
  const questionIndex = fieldName.split('-')[1];
  const correctAnswer = questions[questionIndex].answer;
  const value = Number(selectedOption.getAttribute('answerIndex'));
  
  appState.answered[fieldName] = value;
  
  // mark option correct or wrong
  const isOptionCorrect = markOption(fieldName, selectedOption);

  if (isOptionCorrect) {
    appState.correctAnswers += 1;
  } else {
    appState.wrongAnswers += 1;
  }

  // update score sheet
  updateScoreSheet();
  
  // disable field so that candidate cannot modify answer
  disableQuestionOptions(fieldName);
}

function markOption(fieldName, selectedOption) {
  const questionIndex = fieldName.split('-')[1];
  const correctAnswer = questions[questionIndex].answer;
  const value = Number(selectedOption.getAttribute('answerIndex'));
  let isOptionCorrect = true;

  if (value === correctAnswer) {
    selectedOption.classList.add('correct');
  } else {
    selectedOption.classList.add('wrong');
    isOptionCorrect = false;
  }

  return isOptionCorrect;
}

function updateScoreSheet() {
  correctScore.innerHTML = appState.correctAnswers;
  wrongScore.innerHTML = appState.wrongAnswers;
  total.innerHTML = questions.length;
}

function disableQuestionOptions(fieldName) {
  const fields = Array.from(document.getElementsByName(fieldName));

  fields.forEach(function(field) {
    field.disabled = true;
  });
}

function generateOptions(fieldName, options, answer) {
  const ul = document.createElement('ul');
  ul.setAttribute('class', 'options');
  
  for (let i = 0; i < options.length; i++) {
    const radio = document.createElement('input');
    const li = document.createElement('li');
    const radioLabel = document.createElement('span');
    const textNode = document.createTextNode(options[i]);

    radio.setAttribute('type', 'radio');
    radio.setAttribute('answerIndex', i);
    radio.setAttribute('name', fieldName);
    radio.setAttribute('value', options[i]);
    radio.addEventListener('change', updateAnswer);

    if (typeof answer === 'number') {
      radio.disabled = true;

      if (answer === i) {
        markOption(fieldName, radio);
        radio.checked = true;
      }
    }

    radioLabel.appendChild(textNode);
    li.appendChild(radio);
    li.appendChild(radioLabel);
    ul.appendChild(li);
  }

  return ul;
}

/**
 * -------------------------------------
 * 
 * run
 * 
 * -------------------------------------
 */
window.addEventListener('DOMContentLoaded', initApp);



const questions=[
    {
      question: 'What does COVID-19 Stands for  in full form?',
      options: [
        'Control of diseases in 2019',
        'Circular oriented virus diseases of 2019',
        'Coronavirus diseases of 2019',
        'Coronavirus dedication of 2019'
      ],
      answer: 2
    },
  
    {
      question:'When was the first case of COVID-19 recorded in Nigeria?',
      options: [
        '12 March 2020',
        '27 Feb 2020',
        '01 April 2020',
        '22 Dec 2019'
      ],
      answer: 1
    },
  
    {
      question: 'Who is the current minister of health in Nigeria?',
      options:[
        'Dr Olorunimbe Mamora',
        'Dr Halima Tayo Alao',
        'Dr Osagie Ehanire',
        'Dr Isaac Folorunso Adewole'
      ],
      answer: 2
    },
    {
      question:' What does WHO stands for?',
      options: [
        'Wuhan health organization',
        'World house organization',
        'Where health is originated',
        'World health organization'
      ],
      answer: 3
    },
    {
      question: ' What does NCDC stands for?',
      options: [
        'Nigeria centre for Disease Control',
        'National centre for Disease Control',
        'Nigeria centre for Disease Coronavirus',
        'New Cases for Disease corona'
      ],
      answer: 0
    },
  ]