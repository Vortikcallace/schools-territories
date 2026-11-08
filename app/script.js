const API_URL = "/api";

let currentTaskIndex = 0;
let lives = 3;
let totalErrors = 0;
let currentTasks = [];

function teacherAuth() {
    const name = document.getElementById('teacher-name').value.trim();
    if (!name) return alert("Введите имя!");
    localStorage.setItem('teacherName', name);
    window.location.href = 'teacher.html';
}

function studentAuth() {
    const name = document.getElementById('student-name').value.trim();
    if (!name) return alert("Введите имя!");
    localStorage.setItem('studentName', name);
    window.location.href = 'student.html';
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

async function saveTasks() {
    const q1 = document.getElementById('task-q1').value.trim();
    const a1 = document.getElementById('task-a1').value.trim().toLowerCase();
    const q2 = document.getElementById('task-q2').value.trim();
    const a2 = document.getElementById('task-a2').value.trim().toLowerCase();
    const q3 = document.getElementById('task-q3').value.trim();
    const a3 = document.getElementById('task-a3').value.trim().toLowerCase();

    if (!q1 || !a1 || !q2 || !a2 || !q3 || !a3) {
        return alert("Необходимо заполнить все три задания и ответы к ним!");
    }

    const teacherName = localStorage.getItem('teacherName') || "Учитель";

    const payload = {
        teacher_name: teacherName,
        tasks: [
            { question: q1, answer: a1 },
            { question: q2, answer: a2 },
            { question: q3, answer: a3 }
        ]
    };

    try {
        await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        alert("Задания сохранены в базу данных!");
    } catch (e) {
        alert("Ошибка сохранения. Проверьте, запущен ли сервер.");
    }
}

async function initStudentGame() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        const data = await response.json();

        if (data.tasks && data.tasks.length > 0) {
            currentTasks = data.tasks;
        } else {
            currentTasks = [
                { question: "2x + 4 = 10", answer: "3" },
                { question: "x^2 - 9 = 0 (положительный)", answer: "3" },
                { question: "5x - 3 = 12", answer: "3" }
            ];
        }
    } catch (e) {
        currentTasks = [
            { question: "2x + 4 = 10", answer: "3" },
            { question: "x^2 - 9 = 0 (положительный)", answer: "3" },
            { question: "5x - 3 = 12", answer: "3" }
        ];
    }

    currentTaskIndex = 0;
    lives = 3;
    totalErrors = 0;

    document.getElementById('weapon-img').src = "images/Sword.png";
    document.getElementById('game-stage-text').innerText = "Подготовка к битве";
    document.getElementById('progress-text').innerText = "Сначала зачаруй меч!";

    loadTask();
}

function loadTask() {
    const stageText = document.getElementById('game-stage-text');
    const questionText = document.getElementById('student-question');
    const answerInput = document.getElementById('student-answer');
    const progressText = document.getElementById('progress-text');
    const weaponImg = document.getElementById('weapon-img');

    if (currentTaskIndex === 0) {
        stageText.innerText = "Зачарование меча";
        progressText.innerText = "Ресурсы: 0/3";
        weaponImg.src = "images/Sword.png";
    } else if (currentTaskIndex === 1) {
        stageText.innerText = "Битва с боссом!";
        progressText.innerText = "Меч зачарован! Бей!";
        weaponImg.src = "images/Sword_upg.png";
    } else if (currentTaskIndex === 2) {
        stageText.innerText = "Последний удар!";
        progressText.innerText = "Добей босса!";
        weaponImg.src = "images/Sword_upg.png";
    }

    if (currentTaskIndex >= currentTasks.length) {
        finishGame(true);
        return;
    }

    questionText.innerText = currentTasks[currentTaskIndex].question;
    answerInput.value = "";
    answerInput.style.display = "block";
    updateLivesDisplay();
}

function updateLivesDisplay() {
    const hearts = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
    document.getElementById('lives-display').innerText = `Попытки: ${hearts}`;
}

function submitAnswer() {
    const userAnswer = document.getElementById('student-answer').value.trim().toLowerCase();
    const correctAnswer = currentTasks[currentTaskIndex].answer;

    if (userAnswer === correctAnswer) {
        if (currentTaskIndex === 0) {
            alert("Верно! Ты зачаровал меч и вступаешь в бой с боссом.");
        } else if (currentTaskIndex === 1) {
            alert("Верно! Ты нанес удар боссу.");
        } else if (currentTaskIndex === 2) {
            alert("Верно! Критический удар! Босс повержен!");
        }

        currentTaskIndex++;
        lives = 3;
        loadTask();
    } else {
        lives--;
        totalErrors++;
        updateLivesDisplay();

        if (lives === 0) {
            alert("Попытки кончились. Босс победил. Игра начинается заново.");
            finishGame(false);
        } else {
            alert(`Неверно! Осталось попыток: ${lives}`);
        }
    }
}

async function finishGame(isWin) {
    document.getElementById('student-answer').style.display = "none";
    document.getElementById('game-stage-text').innerText = isWin ? "ПОБЕДА!" : "ПОРАЖЕНИЕ";
    document.getElementById('student-question').innerText = isWin ? "Босс повержен!" : "Босс оказался сильнее...";
    document.getElementById('progress-text').innerText = "";

    const studentName = localStorage.getItem('studentName') || "Ученик";

    try {
        await fetch(`${API_URL}/stats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student: studentName,
                status: isWin ? "Победа" : "Провал",
                errors: totalErrors
            })
        });
    } catch (e) {
        console.error("Не удалось сохранить статистику");
    }

    setTimeout(() => {
        window.location.href = 'student_stats.html';
    }, 2000);
}

async function renderStats() {
    const tbody = document.querySelector('#stats-table tbody');
    if (!tbody) return;
    tbody.innerHTML = "";

    try {
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();

        if (!data.stats || data.stats.length === 0) {
            tbody.innerHTML = "<tr><td colspan='3'>Нет данных</td></tr>";
        } else {
            data.stats.forEach(s => {
                tbody.innerHTML += `<tr>
                    <td>${s.student}</td>
                    <td>${s.status}</td>
                    <td>${s.errors}</td>
                </tr>`;
            });
        }
    } catch (e) {
        tbody.innerHTML = "<tr><td colspan='3'>Ошибка загрузки статистики</td></tr>";
    }
}

window.onload = () => {
    const page = window.location.pathname.split('/').pop();

    if (page === 'teacher.html') {
        const name = localStorage.getItem('teacherName');
        if (!name) return window.location.href = 'login_teacher.html';
        document.getElementById('teacher-display-name').innerText = name;
    }
    else if (page === 'student.html') {
        const name = localStorage.getItem('studentName');
        if (!name) return window.location.href = 'login_student.html';
        initStudentGame();
    }
    else if (page === 'teacher_stats.html') {
        const name = localStorage.getItem('teacherName');
        if (!name) return window.location.href = 'login_teacher.html';
        document.getElementById('stats-teacher-name').innerText = name;
        renderStats();
    }
    else if (page === 'student_stats.html') {
        renderStats();
    }
};
