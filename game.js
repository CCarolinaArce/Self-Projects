const question = document.getElementById("question")
const choices = Array.from(document.getElementsByClassName("choice-text"))
const progressText = document.getElementById("progressText")
const scoreText = document.getElementById("score")
const progressBarFull = document.getElementById('progressBarFull')
const loader = document.getElementById('loader')
const game = document.getElementById('game')

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];


let questions = [ 
{
    "question": "Inside which HTML element do we put the javaScript??",
    "choice1": "< script>",
    "choice2": "< javascript>",
    "choice3": "< js>",
    "choice4": "< scripting >",
    "answer": 1
},
{
    "question": "What is the correct syntax for referring to an external script called 'xxx.js'?",
    "choice1": "< script href= 'xxx.js'>",
    "choice2": "< script name='xxx.js'>",
    "choice3": "< script src='xxx.js'>",
    "choice4": "< script file='xxx.js' >",
    "answer": 3
},
{
    "question": "How do you write 'Hello World' in an alert box?",
    "choice1": "msgBox('Hello World');",
    "choice2": "alertBox('Hello Wrold');",
    "choice3": "msg('Hello World');",
    "choice4": "alert('Hello World');",
    "answer": 4
}]

fetch(
    "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
    )
    .then(res => {
        return res.json()
    })
    .then(loadedQuestions => {
        console.log(loadedQuestions.results)
        questions = loadedQuestions.results.map(loadedQuestions => {
            const formattedQuestion = {
                question: loadedQuestions.question
            }
            
            const answerChoices = [...loadedQuestions.incorrect_answers]
            formattedQuestion.answer = Math.floor(Math.random() * 10) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestions.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice
            })
            return formattedQuestion
        })
        
        startGame()
      
    })
    .catch(err => {
        console.error(err);
    })

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]
    getNewQuestion()
    game.classList.remove('hidden')
    loader.classList.add('hidden')
}

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score)
     // ---> go to the end page...  
        return window.location.assign('/end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`
// Update progress bar...
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question


    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number];
    })
    availableQuestions.splice(questionIndex,1)
    acceptingAnswers= true;
}
choices.forEach(choice => {
    choice.addEventListener('click', e =>  {
     if (!acceptingAnswers) return;

     acceptingAnswers = false;
     const selectedChoice = e.target;
     const selectedAnswer = selectedChoice.dataset['number']

     const classToApply = 
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
        incrementScore(CORRECT_BONUS)
    }    

    selectedChoice.parentElement.classList.add(classToApply)

    setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply)
        getNewQuestion();
    }, 1000)
    })
})

incrementScore = num => {
    score += num
    scoreText.innerText = score;
}

startGame();
