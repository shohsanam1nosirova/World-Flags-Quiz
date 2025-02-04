let countries = [];
let remainingFlags = [];
let currentCountry = {};
let score = 0;
let answeredFlags = 0;
let totalFlags = 195;
let timer;
let timeLeft = 5;

// Fetch country data
fetch("https://restcountries.com/v3.1/all")
    .then(response => response.json())
    .then(data => {
        countries = data.map(c => ({
            name: c.name.common,
            flag: c.flags.png
        }));
        remainingFlags = [...countries].slice(0, totalFlags);
        updateStats();
        loadNewFlag();
    })
    .catch(error => console.error("Error fetching countries:", error));

function updateStats() {
    document.getElementById("flagsLeft").innerText = `${answeredFlags}/${totalFlags}`;
    document.getElementById("score").innerText = `Score: ${score}`;
}

function loadNewFlag() {
    if (remainingFlags.length === 0) {
        endGame();
        return;
    }
    let randomIndex = Math.floor(Math.random() * remainingFlags.length);
    currentCountry = remainingFlags[randomIndex];
    remainingFlags.splice(randomIndex, 1);
    answeredFlags++;
    document.getElementById("flag").src = currentCountry.flag;
    document.getElementById("result").innerText = "";
    updateStats();
    resetTimer();
    loadOptions();
}

function loadOptions() {
    let options = [currentCountry];
    while (options.length < 4) {
        let randomCountry = countries[Math.floor(Math.random() * countries.length)];
        if (!options.includes(randomCountry)) {
            options.push(randomCountry);
        }
    }
    options.sort(() => Math.random() - 0.5);
    let optionsHTML = options.map(option => `<button class="option" onclick="checkAnswer('${option.name}')">${option.name}</button>`).join('');
    document.getElementById("options").innerHTML = optionsHTML;
}

function resetTimer() {
    timeLeft = 5;
    document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            loadNewFlag();
        }
    }, 1000);
}

function checkAnswer(selectedName) {
    clearInterval(timer); // Stop timer when an answer is selected
    if (selectedName === currentCountry.name) {
        score += 5;
        document.getElementById("score").innerText = `Score: ${score} (+5)`;
        setTimeout(() => {
            document.getElementById("score").innerText = `Score: ${score}`;
        }, 1000);
    }
    loadNewFlag();
}

function endGame() {
    clearInterval(timer);
    let message;
    if (score <= 215) {
        message = "You need more practice! Keep going!";
    } else if (score <= 450) {
        message = "Good job! You're learning well!";
    } else if (score <= 700) {
        message = "Impressive! You really know your flags!";
    } else {
        message = "Amazing! You're a geography master!";
    }
    document.body.innerHTML = `<div id="restart">
        <h2>Game Over!</h2>
        <h3>You guessed ${score / 5} flags correctly!</h3>
        <p>${message}</p>
        <button id="play-again-button" class="option:hover" onclick="restartGame()">Play Again</button>
    </div>`;
}

function restartGame() {
    document.body.innerHTML = `
        <div class="header">
            <h2 id="flagsLeft">0/195</h2>
            <h2 id="score">Score: 0</h2>
            <h2 id="timer">30s</h2>
        </div>
        <h1>Guess the Country Name</h1>
        <div class="container">
            <img id="flag" src="" alt="Country Flag">
            <div id="options"></div>
            <h2 id="result"></h2>
        </div>
    `;
    score = 0;
    answeredFlags = 0;
    remainingFlags = [...countries].slice(0, totalFlags);
    updateStats();
    loadNewFlag();
}
