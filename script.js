document.querySelector(".btn-reset").addEventListener("click", resetGame);
const dialog = document.querySelector(".message");

window.addEventListener("load", startGame);

const X_HTML = `
  <div class="x">
    <div class="line"></div>
    <div class="line"></div>
  </div>`;
const X_SQUARE_COLOR = "rgb(5, 35, 92)";

const O_HTML = `
  <div class="o">
    <div class="circle"></div>
  </div>`;
const O_SQUARE_COLOR = "rgb(96, 6, 46)";

const SQUARE_EXIT_ANIMATION_DURATION = 200;

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Fila superior
  [3, 4, 5], // Fila del medio
  [6, 7, 8], // Fila inferior
  [0, 3, 6], // Columna izquierda
  [1, 4, 7], // Columna del medio
  [2, 5, 8], // Columna derecha
  [0, 4, 8], // Diagonal principal
  [2, 4, 6], // Diagonal secundaria
];

let turn, turnAI, playerOne, playerTwo;
let board = [
  [-1, -1, -1],
  [-1, -1, -1],
  [-1, -1, -1],
];
let squaresUsed = [];
let winnerExists = false;

function startGame() {
  // Reestablece todo como si se va a jugar por primera vez
  resetGame();
}

function resetGame() {
  // Habilitar las casillas
  toggleSquares(true);
  // Reiniciar el tablero.
  board = [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ];
  // Reinicia la lista de casillas usadas.
  squaresUsed = [];
  // Establece que no hay ganador
  winnerExists = false;
  // Limpiar visualmente el tablero.
  cleanBoard();
  // Seleccionar un turno.
  turn = selectTurn();
  turnAI = selectTurn();

  // Si la IA comienza, realiza su movimiento.
  if (turnAI == turn) {
    // Establecer que la AI es el jugador 1
    playerOne = turn;
    playerTwo = 1 - turn;
    // Inhabilitamos las casillas
    toggleSquares(false);
    playerAI(); // Movimiento de IA
    setTimeout(() => {
      toggleSquares(true);
    }, 500);
  } else {
    // Establecer que la AI es el jugador 2
    playerOne = 1 - turn;
    playerTwo = turn;
  }

  // Cerrar el diálogo si está abierto.
  dialog.close();
}

function handleSquareClick(squareId) {
  // 1. Si la casilla es válida.
  if (!squaresUsed.includes(squareId) && !winnerExists) {
    // Dibujar la X/O dependiendo del turno.
    draw(squareId);
    // Actualizar el tablero con el turno.
    updateBoard(squareId, turn);
    // Cambiar el turno.
    turn = 1 - turn;
    // Verificar si hay un ganador o es empate.
    const gameEnded = checkWinner();
    // Solo la IA hace su movimiento si el juego no ha terminado y el turno actual es el de la IA.
    if (!gameEnded && turn === turnAI) {
      toggleSquares(false);
      setTimeout(() => {
        playerAI();
        toggleSquares(true);
      }, 500);
    }
  }
}

function selectTurn() {
  return Math.round(Math.random());
}

function draw(squareId) {
  const square = document.querySelector(`#square-${squareId}`);
  square.innerHTML = turn == 1 ? X_HTML : O_HTML;
  square.style.backgroundColor = turn === 1 ? X_SQUARE_COLOR : O_SQUARE_COLOR;
}

function updateBoard(squareId, turn) {
  // 1. Convertir squareId en una posición de matriz (fila y columna).
  const adjustedId = squareId - 1;
  const row = Math.floor(adjustedId / 3);
  const col = adjustedId % 3;
  // 2. Actualizar la matriz `board` con el valor correspondiente (1 para "x", 0 para "o").
  board[row][col] = turn;
  // 3. Agregar squareId a la lista de casillas usadas.
  squaresUsed.push(squareId);
}

function checkWinner() {
  let winnerCheck;
  winnerExists = WINNING_COMBINATIONS.some((combination) => {
    const [a, b, c] = combination;
    const aValue = board[Math.floor(a / 3)][a % 3];
    const bValue = board[Math.floor(b / 3)][b % 3];
    const cValue = board[Math.floor(c / 3)][c % 3];
    winnerCheck = aValue;
    return aValue !== -1 && aValue === bValue && aValue === cValue;
  });

  if (winnerExists) {
    dialog.innerHTML = `¡Ganador: ${winnerCheck == 1 ? "X" : "O"}!`;
    dialog.showModal();
    return true;
  } else if (squaresUsed.length >= 9) {
    dialog.innerHTML = `¡Empate!`;
    dialog.showModal();
    return true;
  }

  return false;
}

function cleanBoard() {
  document.querySelectorAll(".square").forEach((square) => {
    if (square.hasChildNodes()) {
      let className = square.children[0].className;
      square.querySelector(`.${className}`).style.animation = "";
      void square.querySelector(`.${className}`).offsetWidth;
      square.querySelector(`.${className}`).style.animation =
        "exit 200ms ease both";
      square.style.backgroundColor = "";
      setTimeout(() => {
        square.innerHTML = "";
      }, SQUARE_EXIT_ANIMATION_DURATION);
    }
  });
}

function playerAI() {
  // Encontrar todas las casillas vacías.
  const emptySquares = Array.from(document.querySelectorAll(".square"))
    .filter((square) => !square.hasChildNodes())
    .map((square) => {
      // Extraer el número del ID
      const id = square.id.split("-")[1];
      return parseInt(id, 10);
    });
  // Elegir una casilla vacía aleatoriamente.
  if (emptySquares.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    const aiMove = emptySquares[randomIndex];
    // Realizar el movimiento llamando a handleSquareClick.
    handleSquareClick(aiMove);
  }
}

function toggleSquares(enable) {
  document.querySelectorAll(".square").forEach((square) => {
    square.classList.toggle("disabled", !enable);
  });
}
