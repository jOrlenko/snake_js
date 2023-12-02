// HTML elements
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOver = document.getElementById('gameOver');
const speedBoard = document.getElementById('speedBoard');

// Game settings
const boardSize = 10;
let gameSpeed = 1000;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    footSquare: 2,
};
const direcctions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};

// Game variables
let snake;
let score;
let direccion;
let boardSquares;
let emptySquares;
let moveInterval;

// Crea Tablero
const createBoard = () => {
    //bucle en el arry en 2 dimenciones
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div')
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
    });
};

// Set Game - Inicial 
const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length;
    direccion = 'ArrowRight';
    //array de dos dimenciones [0[0,1,2,3...9],1[0,1,2,3..9], ... ,9[0,1,2...]]
    boardSquares = Array.from(Array(boardSize), () => Array(boardSize).fill(squareTypes.emptySquare));
    //borra el board si el jugador pierde
    board.innerHTML = '';

    emptySquares = [];
    createBoard();
};


// Rellena cada cuadrado del tablero
// @params
// square: posicion del cuadrado;
// type: tipo del cuadrado (empty, snake, food)
const drawSquare = (square, type) => {
    const [row, col] = square.split('');
    boardSquares[row][col] = squareTypes[type];
    const squareElemen = document.getElementById(square);
    squareElemen.setAttribute('class', `square ${type}`);


    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if (emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        };
    };
};
// Dibuja la serpiente
const drawSnake = () => {
    snake.forEach( square => drawSquare(square, 'snakeSquare'));
};

// Crea comida en random
const createRandomFood = () => {
    const emptySquareRandom = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(emptySquareRandom, 'footSquare');
}


// acelera la serpiente
const acelerar = () => {
    if (score % 3 === 0) {
        gameSpeed = gameSpeed - 50;
        speedBoard.innerText = gameSpeed + 'ms';
    }
}

// setea el score
const updateScore = () => {
    scoreBoard.innerText = score;
    acelerar();
};

// devuelve la direcion
const setDireccion = newDireccion => {
    direccion = newDireccion;
};

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direccion != 'ArrowDown' && setDireccion(key.code);
            break;
        case 'ArrowDown':
            direccion != 'ArrowUp' && setDireccion(key.code);
            break;
        case 'ArrowRight':
            direccion != 'ArrowLeft' && setDireccion(key.code);
            break;
        case 'ArrowLeft':
            direccion != 'ArrowRight' && setDireccion(key.code);
            break;
        default:
            break;
    }  
}

// mueve la serpiente
const moveSnake = () => {
    const newSquare = String(Number(snake[snake.length - 1]) + direcctions[direccion]).padStart(2, '0');
    const [row, col] = newSquare.split('');
    console.log(newSquare)

    if( newSquare < 0 || 
        newSquare > boardSize * boardSize ||
        (direccion === 'ArrowRight' && col == 0) ||
        (direccion === 'ArrowLeft' && col == 9 ||
        boardSquares[row][col] === squareTypes.snakeSquare)) {
            game_Over();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][col] === squareTypes.footSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}

// comer
const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
};

// gameOver
const game_Over = () => {
    gameOver.style.display = 'block';
    clearInterval(moveInterval);
    startButton.disabled = false;
}

// Start Game
const startGame = () => {
    setGame();
    //se setea gameOver en none para que no se muestre, por si ha habido un game over anterior
    gameOver.style.display = 'none';
    //bloquea el boton de start una vez iniciado el juego
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval( () => moveSnake(), gameSpeed);
};

// Start Game -> button
startButton.addEventListener('click', startGame);