// script.js

let timers = document.querySelectorAll('.timer');
let cutButtons = document.querySelectorAll('.cut-button');
let startButton = document.getElementById('startButton');
let questionBank = [
    "Cada jugador deberá compartir una estrategia que use para organizar su tiempo y deberán escribirlas todas",
    "Mencionen una herramienta que uses para la organización de encuentros y reuniones",
    "Mencionen una herramienta que sirva para organizar tareas y proyectos",
    "Mencionen una acción que ayude a liberar un poco las cargas, confiando labores en el equipo",
    "Mencionen una acción que ayude a elegir una tarea por encima de otras",
    "Mencionen una alternativa que les ayude a recordar acciones o tareas",
    "Mencionen una herramienta que puede ser física o virtual y que ayuda con la organización de tareas",
    "Mencione una herramienta/técnica que ayuda a trabajar y descansar por tiempos específicos",
    "Mencione programas o aplicaciones que ayuden con el manejo y la optimización del tiempo",
    "Mencione programas que permitan el trabajo conjunto de un equipo",
    "Mencione una estrategia que les permita reconocer sus avances y cumplimiento de actividades",
    "Mencione un ejercicio o proceso que se ejecuta antes de llevar a cabo algún proyecto",
    "Mencione un ejercicio o procesos que se ejecuta durante la realización de un proyecto, con el fin de identificar su desarrollo y/u oportunidades de mejora",
    "Mencione una herramienta actual que nos permita consultar y construir tareas de una manera mucho más rápida, automática y eficiente",
    "Mencione una forma eficaz para encontrar recursos en el equipo o con otras personas"
];

let correctKeywords = [
    "google calendar", "trello", "miro", "jira", "delegar", "buscar apoyo", "priorizar", "recordatorios", "agenda", 
    "cuaderno", "cronograma", "pomodoro", "onetab", "rescuetime", "google keep", "figma", "activecollab", "teamwork", 
    "google meet", "zoom", "planificar", "organizar", "evaluación", "ia", "chatgpt", "pedir ayuda", "comunicar", 
    "notas", "alarmas", "hacer preguntas", "matriz", "apoyo", "planner", "proyectos", "controlar", "enfocar", 
    "lista de tareas", "scoro", "proofhub", "bitrix24", "toggl"
];

// Convert all keywords to lowercase for easy comparison
correctKeywords = correctKeywords.map(keyword => keyword.toLowerCase());

let timersActive = false;
let mainTimer;
let individualTimers = [];

// Function to start all timers
function startTimers() {
    timersActive = true;
    timers.forEach((timer, index) => {
        const initialTime = parseInt(timer.dataset.time);
        let remainingTime = initialTime;
        
        individualTimers[index] = setInterval(() => {
            updateTimer(timer, index, remainingTime);
            remainingTime--;
        }, 1000);
    });
    mainTimer = setInterval(() => updateMainTimer(), 1000);
}

// Function to update individual timer
function updateTimer(timer, index, remainingTime) {
    timer.textContent = `${Math.floor(remainingTime / 60)}:${remainingTime % 60 < 10 ? '0' : ''}${remainingTime % 60}`;
    if (remainingTime <= 0) {
        clearInterval(individualTimers[index]);
        individualTimers[index] = null;
        gameOver(false);
    }
}

// Function to handle cut button click
cutButtons.forEach((button, index) => {
    button.addEventListener('click', () => askQuestion(index));
});

// Function to ask question and validate response
function askQuestion(index) {
    let randomQuestion = questionBank[Math.floor(Math.random() * questionBank.length)];
    let answer = prompt(randomQuestion);

    if (isCorrectAnswer(answer)) {
        clearInterval(individualTimers[index]);
        individualTimers[index] = null;
        cutButtons[index].disabled = true;
        checkWinCondition();
    } else {
        // If the answer is incorrect, reset the first inactive timer found
        resetInactiveTimers();
    }
}

// Function to check if the answer is correct
function isCorrectAnswer(answer) {
    if (!answer) return false; // Return false if no answer was provided
    return correctKeywords.some(keyword => answer.toLowerCase().includes(keyword));
}

// Function to reset the first inactive timer found
function resetInactiveTimers() {
    for (let i = 0; i < timers.length; i++) {
        if (!individualTimers[i] && cutButtons[i].disabled === true) { // Timer is inactive and button is also inactive
            const initialTime = parseInt(timers[i].dataset.time);
            timers[i].textContent = `${Math.floor(initialTime / 60)}:${initialTime % 60 < 10 ? '0' : ''}${initialTime % 60}`;
            let remainingTime = initialTime;

            // Reactivate the timer and button
            cutButtons[i].disabled = false;
            individualTimers[i] = setInterval(() => {
                updateTimer(timers[i], i, remainingTime);
                remainingTime--;
            }, 1000);

            break; // Stop after reactivating the first found inactive timer
        }
    }
}

// Function to check win condition
function checkWinCondition() {
    if ([...cutButtons].every(button => button.disabled)) {
        clearInterval(mainTimer);
        alert("🎉🎉🎉 ¡Felicitaciones! 🎉🎉🎉 Has logrado desactivar la bomba a tiempo ⏰");
        resetGame();
    }
}

// Function to end game if main timer or any timer reaches zero
function gameOver(hasWon) {
    alert(hasWon ? "🎉🎉🎉 ¡Felicitaciones! 🎉🎉🎉 Has logrado desactivar la bomba a tiempo ⏰" : "💣 Lo sentimos, la bomba ha explotado 💣");
    resetGame();
}

// Function to reset game
function resetGame() {
    timers.forEach((timer, index) => {
        const initialTime = parseInt(timer.dataset.time);
        timer.textContent = `${Math.floor(initialTime / 60)}:${initialTime % 60 < 10 ? '0' : ''}${initialTime % 60}`;
    });
    cutButtons.forEach(button => button.disabled = false);
    clearInterval(mainTimer);
    individualTimers.forEach((timer, index) => {
        clearInterval(timer);
        individualTimers[index] = null;
    });
    timersActive = false;
}

// Attach start function to start button
startButton.addEventListener('click', startTimers);