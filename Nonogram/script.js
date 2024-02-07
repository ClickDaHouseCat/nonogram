// Находим контейнеры для таблицы и кнопку
let allTablesContainer = document.createElement("div");
allTablesContainer.classList.add("allTables");

let leftTableContainer = document.createElement("div");
leftTableContainer.classList.add("leftTable");
leftTableContainer.id = "leftTableContainer";

let rightTableContainer = document.createElement("div");
rightTableContainer.classList.add("rightTable");
rightTableContainer.id = "rightTableContainer";

let button = document.createElement("button");
button.textContent = "Решение";
button.onclick = selectAllOnes;

// Добавляем созданные элементы на страницу
document.body.appendChild(allTablesContainer);
allTablesContainer.appendChild(leftTableContainer);
allTablesContainer.appendChild(rightTableContainer);
document.body.appendChild(button);

let currentTableSize; // Переменная для хранения размера текущей таблицы

function generateRandomTable(rows, cols) {
    currentTableSize = rows; // Устанавливаем текущий размер таблицы
    let table = "<table border='1' class='mainTable'>";
    let rowSums = new Array(rows).fill(0); // Массив для хранения сумм каждой строки
    let columnSums = new Array(cols).fill(0); // Массив для хранения сумм каждого столбца

    for (let i = 0; i < rows; i++) {
        table += "<tr>";
        rowSums[i] = 0; // Сброс суммы для текущей строки
        for (let j = 0; j < cols; j++) {
            let randomValue = Math.round(Math.random());
            rowSums[i] += randomValue; // Увеличиваем сумму текущей строки
            columnSums[j] += randomValue; // Увеличиваем сумму текущего столбца
            table += "<td>" + randomValue + "</td>";
        }
        table += "</tr>";
    }

    table += "</table>";

    // Создаем новую таблицу для вывода сумм строк
    let rowSumTable = "<table border='1'>";
    for (let m = 0; m < rows; m++) {
        rowSumTable += "<tr><td class='sumRow'>" + rowSums[m] + "</td></tr>"; // Добавляем класс sumRow для ячеек с суммами строк
    }
    rowSumTable += "</table>";

    // Создаем новую таблицу для вывода сумм столбцов
    let columnSumTable = "<table border='1'>";
    columnSumTable += "<tr class='sumRow'>"; // Добавляем класс sumRow для строки с суммами столбцов
    for (let k = 0; k < columnSums.length; k++) {
        columnSumTable += "<td>" + columnSums[k] + "</td>";
    }
    columnSumTable += "</tr>";
    columnSumTable += "</table>";

    // Добавляем таблицы с суммами столбцов и строк в соответствующие блоки
    document.getElementById("leftTableContainer").innerHTML = rowSumTable;
    document.getElementById("rightTableContainer").innerHTML = table + columnSumTable;

    // Добавляем обработчики событий для каждой ячейки основной таблицы
    let mainTableCells = document.querySelectorAll('.mainTable td');
    mainTableCells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            this.classList.toggle('selected');
            playClickSound();
            startTimer();
            checkWin(); // Проверяем победу после каждого клика
        });
    });
}

// Генерируем таблицу 5x5 при загрузке страницы
generateRandomTable(5, 5);

// Функция для воспроизведения звука нажатия на ячейку
function playClickSound() {
    let audio = new Audio('./assets/audio/click.mp3'); // Путь к звуковому файлу
    audio.play();
}

function playWinSound() {
    let audio = new Audio('./assets/audio/winner.mp3'); // Путь к звуковому файлу
    audio.play();
}

function createButton(text, rows, cols) {
    let button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", function() {
        generateRandomTable(rows, cols);
    });
    document.body.appendChild(button);
}

// Создаем кнопку для генерации случайного варианта
let randomButton = document.createElement("button");
randomButton.textContent = "Случайный вариант";
randomButton.addEventListener("click", function() {
    let sizes = [5, 10, 15];
    let randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    generateRandomTable(randomSize, randomSize);
});
document.body.appendChild(randomButton);


// Создаем по одной кнопке на каждый размер таблицы
createButton("Создать таблицу 5x5", 5, 5);
createButton("Создать таблицу 10x10", 10, 10);
createButton("Создать таблицу 15x15", 15, 15);

// Функция для выделения всех единиц в таблице
function selectAllOnes() {
    let cells = document.querySelectorAll('.mainTable td');
    cells.forEach(function(cell) {
        if (cell.textContent === '1') {
            cell.classList.add('selected');
        } else {
            cell.classList.remove('selected');
        }
    });
}

// Функция для проверки победы
function checkWin() {
    let cells = document.querySelectorAll('.mainTable td');
    let allSelected = true;
    cells.forEach(function(cell) {
        if (cell.textContent === '1' && !cell.classList.contains('selected')) {
            allSelected = false;
        }
    });
    if (allSelected) {
        let currentTime = timerElement.textContent; // Получаем текущее время
        addGameResult(currentTableSize, currentTime); // Добавляем результат текущей игры в список
        alert("Отлично! Вы решили нонограмму! | You have solved the nonogram!");
        playWinSound()
        stopTimer();
    }
}

// Создаем элемент для отображения таймера
let timerElement = document.createElement("div");
timerElement.textContent = "00:00";
document.body.appendChild(timerElement);

let timerInterval; // Переменная для хранения интервала таймера
let seconds = 0;
let minutes = 0;

// Функция для запуска таймера
function startTimer() {
    timerInterval = setInterval(function() {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        let formattedTime = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        timerElement.textContent = formattedTime;
    }, 1000);
}

// Функция для остановки таймера
function stopTimer() {
    clearInterval(timerInterval);
}

let recentGames = []; // Массив для хранения результатов последних пяти игр

// Функция для добавления результата игры в список
function addGameResult(size, time) {
    recentGames.push({ size: size, time: time });
    if (recentGames.length > 5) {
        recentGames.shift(); // Удаляем первый элемент, если список превысил пять элементов
    }
    displayRecentGames(); // Обновляем отображение списка на странице
}

// Функция для отображения списка последних игр на странице
function displayRecentGames() {
    let listElement = document.createElement("ul");
    listElement.innerHTML = "<h2>Последние игры:</h2>";
    recentGames.forEach(function(game) {
        let item = document.createElement("li");
        item.textContent = "Размер: " + game.size + "x" + game.size + ", Время: " + game.time;
        listElement.appendChild(item);
    });
    document.body.appendChild(listElement);
}


// Создаем кнопку для смены темы
let themeButton = document.createElement("button");
themeButton.textContent = "Сменить тему";
themeButton.addEventListener("click", function() {
    document.body.classList.toggle("themeBlack");
});
document.body.appendChild(themeButton);

// Добавляем обработчик события для правого клика по ячейке
let mainTableCells = document.querySelectorAll('.mainTable td');
mainTableCells.forEach(function(cell) {
    cell.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // Предотвращаем появление контекстного меню браузера
        if (!this.classList.contains('selected')) { // Проверяем, что ячейка не выделена
            this.innerHTML = "<span class='cross'>&times;</span>"; // Добавляем крест в ячейку
        }
    });
});