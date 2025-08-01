// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Конфигурация игры
const GAME_CONFIG = {
    BOARD_SIZE: 8,
    GAME_DURATION: 120, // 2 минуты в секундах
    MIN_MATCH: 3,
    POINTS_PER_MATCH: 10,
    BONUS_POINTS: 5 // дополнительные очки за каждую плитку после 3-й
};

// Иконки языков программирования
const PROGRAMMING_ICONS = [
    { type: 'java', image: 'images/java.svg', color: '#ed8b00' },
    { type: 'android', image: 'images/android.svg', color: '#3ddc84' },
    { type: 'swift', image: 'images/swift.svg', color: '#ff6b35' },
    { type: 'go', image: 'images/go.svg', color: '#00add8' },
    { type: 'csharp', image: 'images/csharp.svg', color: '#239120' },
    { type: 'php', image: 'images/php.svg', color: '#777bb4' },
    { type: 'javascript', image: 'images/javascript.svg', color: '#f7df1e' },
    { type: 'python', image: 'images/python.svg', color: '#3776ab' }
];

// Состояние игры
let gameState = {
    board: [],
    selectedTile: null,
    score: 0,
    timeLeft: GAME_CONFIG.GAME_DURATION,
    isGameActive: false,
    timer: null
};

// DOM элементы
const elements = {
    gameBoard: document.getElementById('gameBoard'),
    score: document.getElementById('score'),
    time: document.getElementById('time'),
    newGameBtn: document.getElementById('newGameBtn'),
    gameOver: document.getElementById('gameOver'),
    finalScore: document.getElementById('finalScore'),
    finalTime: document.getElementById('finalTime'),
    restartBtn: document.getElementById('restartBtn')
};

// Инициализация игры
function initGame() {
    createBoard();
    setupEventListeners();
    startNewGame();
}

// Создание игрового поля
function createBoard() {
    elements.gameBoard.innerHTML = '';
    elements.gameBoard.style.gridTemplateColumns = `repeat(${GAME_CONFIG.BOARD_SIZE}, 1fr)`;
    
    for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
        gameState.board[row] = [];
        for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
            const tile = createTile(row, col);
            elements.gameBoard.appendChild(tile);
            gameState.board[row][col] = tile;
        }
    }
}

// Создание валидного игрового поля с возможными ходами
function createValidBoard() {
    let attempts = 0;
    const maxAttempts = 20; // Уменьшили количество попыток для быстрой работы
    
    do {
        // Очистка поля
        for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
            for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
                replaceTile(row, col);
            }
        }
        
        // Убираем начальные совпадения
        removeInitialMatches();
        
        attempts++;
    } while (!hasValidMoves() && attempts < maxAttempts);
    
    // Если не удалось создать валидное поле, создаем простое поле
    if (attempts >= maxAttempts) {
        console.log('Не удалось создать валидное поле за', maxAttempts, 'попыток, создаем простое');
        for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
            for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
                replaceTile(row, col);
            }
        }
    } else {
        console.log('Валидное поле создано за', attempts, 'попыток');
    }
}

// Создание плитки
function createTile(row, col) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.row = row;
    tile.dataset.col = col;
    
    const randomIcon = PROGRAMMING_ICONS[Math.floor(Math.random() * PROGRAMMING_ICONS.length)];
    tile.dataset.type = randomIcon.type;
    
    // Создаем изображение
    const img = document.createElement('img');
    img.src = randomIcon.image;
    img.alt = randomIcon.type;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    
    tile.appendChild(img);
    tile.style.color = randomIcon.color;
    
    tile.addEventListener('click', () => handleTileClick(row, col));
    
    return tile;
}

// Обработка клика по плитке
function handleTileClick(row, col) {
    if (!gameState.isGameActive) return;
    
    const tile = gameState.board[row][col];
    
    if (!gameState.selectedTile) {
        // Выбор первой плитки
        gameState.selectedTile = { row, col };
        tile.classList.add('selected');
    } else {
        // Выбор второй плитки
        const firstTile = gameState.board[gameState.selectedTile.row][gameState.selectedTile.col];
        firstTile.classList.remove('selected');
        
        if (gameState.selectedTile.row === row && gameState.selectedTile.col === col) {
            // Клик по той же плитке - отмена выбора
            gameState.selectedTile = null;
        } else if (isAdjacent(gameState.selectedTile, { row, col })) {
            // Попытка обмена
            swapTiles(gameState.selectedTile, { row, col });
        }
        
        gameState.selectedTile = null;
    }
}

// Проверка соседства плиток
function isAdjacent(pos1, pos2) {
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// Обмен плиток
function swapTiles(pos1, pos2) {
    const tile1 = gameState.board[pos1.row][pos1.col];
    const tile2 = gameState.board[pos2.row][pos2.col];
    
    // Временно меняем местами
    const tempType = tile1.dataset.type;
    const tempColor = tile1.style.color;
    const tempImg = tile1.querySelector('img').cloneNode(true);
    
    // Находим иконки для обмена
    const icon1 = PROGRAMMING_ICONS.find(icon => icon.type === tile1.dataset.type);
    const icon2 = PROGRAMMING_ICONS.find(icon => icon.type === tile2.dataset.type);
    
    // Обновляем первую плитку
    tile1.dataset.type = tile2.dataset.type;
    tile1.innerHTML = '';
    const img1 = document.createElement('img');
    img1.src = icon2.image;
    img1.alt = icon2.type;
    img1.style.width = '100%';
    img1.style.height = '100%';
    img1.style.objectFit = 'contain';
    tile1.appendChild(img1);
    tile1.style.color = tile2.style.color;
    
    // Обновляем вторую плитку
    tile2.dataset.type = tempType;
    tile2.innerHTML = '';
    const img2 = document.createElement('img');
    img2.src = icon1.image;
    img2.alt = icon1.type;
    img2.style.width = '100%';
    img2.style.height = '100%';
    img2.style.objectFit = 'contain';
    tile2.appendChild(img2);
    tile2.style.color = tempColor;
    
    // Проверяем, есть ли совпадения
    setTimeout(() => {
        const matches = findMatches();
        if (matches.length > 0) {
            processMatches(matches);
        } else {
            // Возвращаем обратно, если нет совпадений
            tile1.dataset.type = tempType;
            tile1.innerHTML = '';
            const img1Back = document.createElement('img');
            img1Back.src = icon1.image;
            img1Back.alt = icon1.type;
            img1Back.style.width = '100%';
            img1Back.style.height = '100%';
            img1Back.style.objectFit = 'contain';
            tile1.appendChild(img1Back);
            tile1.style.color = tempColor;
            
            tile2.dataset.type = tile2.dataset.type;
            tile2.innerHTML = '';
            const img2Back = document.createElement('img');
            img2Back.src = icon2.image;
            img2Back.alt = icon2.type;
            img2Back.style.width = '100%';
            img2Back.style.height = '100%';
            img2Back.style.objectFit = 'contain';
            tile2.appendChild(img2Back);
            tile2.style.color = tile2.style.color;
        }
    }, 300);
}

// Поиск совпадений
function findMatches() {
    const matches = [];
    
    // Проверка горизонтальных совпадений
    for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
        for (let col = 0; col < GAME_CONFIG.BOARD_SIZE - 2; col++) {
            const type1 = gameState.board[row][col].dataset.type;
            const type2 = gameState.board[row][col + 1].dataset.type;
            const type3 = gameState.board[row][col + 2].dataset.type;
            
            if (type1 === type2 && type2 === type3) {
                const match = [];
                for (let i = 0; i < 3; i++) {
                    match.push({ row, col: col + i });
                }
                matches.push(match);
            }
        }
    }
    
    // Проверка вертикальных совпадений
    for (let row = 0; row < GAME_CONFIG.BOARD_SIZE - 2; row++) {
        for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
            const type1 = gameState.board[row][col].dataset.type;
            const type2 = gameState.board[row + 1][col].dataset.type;
            const type3 = gameState.board[row + 2][col].dataset.type;
            
            if (type1 === type2 && type2 === type3) {
                const match = [];
                for (let i = 0; i < 3; i++) {
                    match.push({ row: row + i, col });
                }
                matches.push(match);
            }
        }
    }
    
    return matches;
}

// Обработка совпадений
function processMatches(matches) {
    const matchedPositions = new Set();
    
    matches.forEach(match => {
        match.forEach(pos => {
            matchedPositions.add(`${pos.row},${pos.col}`);
        });
    });
    
    // Подсчет очков
    const totalMatched = matchedPositions.size;
    const points = GAME_CONFIG.POINTS_PER_MATCH * Math.floor(totalMatched / GAME_CONFIG.MIN_MATCH) + 
                   GAME_CONFIG.BONUS_POINTS * (totalMatched - GAME_CONFIG.MIN_MATCH);
    
    gameState.score += points;
    updateScore();
    
    // Анимация совпадений
    matchedPositions.forEach(posStr => {
        const [row, col] = posStr.split(',').map(Number);
        const tile = gameState.board[row][col];
        tile.classList.add('matched');
        
        setTimeout(() => {
            tile.classList.remove('matched');
            replaceTile(row, col);
        }, 500);
    });
    
    // Проверка новых совпадений после замены
    setTimeout(() => {
        const newMatches = findMatches();
        if (newMatches.length > 0) {
            processMatches(newMatches);
        }
    }, 600);
}

// Замена плитки
function replaceTile(row, col) {
    const tile = gameState.board[row][col];
    const randomIcon = PROGRAMMING_ICONS[Math.floor(Math.random() * PROGRAMMING_ICONS.length)];
    
    tile.dataset.type = randomIcon.type;
    
    // Очищаем плитку и добавляем новое изображение
    tile.innerHTML = '';
    const img = document.createElement('img');
    img.src = randomIcon.image;
    img.alt = randomIcon.type;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    
    tile.appendChild(img);
    tile.style.color = randomIcon.color;
    tile.classList.add('new');
    
    setTimeout(() => {
        tile.classList.remove('new');
    }, 500);
}

// Удаление начальных совпадений
function removeInitialMatches() {
    let hasMatches = true;
    while (hasMatches) {
        const matches = findMatches();
        if (matches.length > 0) {
            // Заменяем совпадающие плитки
            const matchedPositions = new Set();
            matches.forEach(match => {
                match.forEach(pos => {
                    matchedPositions.add(`${pos.row},${pos.col}`);
                });
            });
            
            matchedPositions.forEach(posStr => {
                const [row, col] = posStr.split(',').map(Number);
                replaceTile(row, col);
            });
        } else {
            hasMatches = false;
        }
    }
}

// Проверка наличия валидных ходов
function hasValidMoves() {
    for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
        for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
            // Проверяем обмен с соседними плитками
            const directions = [
                { row: -1, col: 0 }, // вверх
                { row: 1, col: 0 },  // вниз
                { row: 0, col: -1 }, // влево
                { row: 0, col: 1 }   // вправо
            ];
            
            for (const dir of directions) {
                const newRow = row + dir.row;
                const newCol = col + dir.col;
                
                if (newRow >= 0 && newRow < GAME_CONFIG.BOARD_SIZE && 
                    newCol >= 0 && newCol < GAME_CONFIG.BOARD_SIZE) {
                    
                    // Пробуем обмен
                    if (wouldCreateMatch(row, col, newRow, newCol)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// Проверка, создаст ли обмен совпадение
function wouldCreateMatch(row1, col1, row2, col2) {
    // Временно меняем местами
    const tile1 = gameState.board[row1][col1];
    const tile2 = gameState.board[row2][col2];
    
    const tempType = tile1.dataset.type;
    tile1.dataset.type = tile2.dataset.type;
    tile2.dataset.type = tempType;
    
    // Проверяем совпадения
    const matches = findMatches();
    
    // Возвращаем обратно
    tile1.dataset.type = tempType;
    tile2.dataset.type = tile1.dataset.type;
    
    return matches.length > 0;
}

// Обновление счета
function updateScore() {
    elements.score.textContent = gameState.score;
}

// Обновление времени
function updateTime() {
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    elements.time.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Таймер игры
function startTimer() {
    gameState.timer = setInterval(() => {
        if (gameState.isGameActive) {
            gameState.timeLeft--;
            updateTime();
            
            if (gameState.timeLeft <= 0) {
                endGame();
            }
        }
    }, 1000);
}

// Начало новой игры
function startNewGame() {
    gameState.score = 0;
    gameState.timeLeft = GAME_CONFIG.GAME_DURATION;
    gameState.isGameActive = true;
    gameState.selectedTile = null;
    
    // Создаем поле с гарантированными возможными ходами
    createValidBoard();
    
    updateScore();
    updateTime();
    elements.gameOver.style.display = 'none';
    
    // Показываем время в заголовке
    elements.time.style.display = 'block';
    
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    startTimer();
    
    // Убираем выделение со всех плиток
    document.querySelectorAll('.tile.selected').forEach(tile => {
        tile.classList.remove('selected');
    });
}



// Окончание игры
function endGame() {
    gameState.isGameActive = false;
    clearInterval(gameState.timer);
    
    const minutes = Math.floor((GAME_CONFIG.GAME_DURATION - gameState.timeLeft) / 60);
    const seconds = (GAME_CONFIG.GAME_DURATION - gameState.timeLeft) % 60;
    const timePlayed = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    elements.finalScore.textContent = gameState.score;
    elements.finalTime.textContent = timePlayed;
    elements.gameOver.style.display = 'flex';
    
    // Скрываем время в заголовке
    elements.time.style.display = 'none';
    
    // Отправка результата в Telegram
    if (tg && tg.sendData) {
        const result = {
            score: gameState.score,
            time: timePlayed
        };
        tg.sendData(JSON.stringify(result));
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    elements.newGameBtn.addEventListener('click', startNewGame);
    elements.restartBtn.addEventListener('click', startNewGame);
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame); 