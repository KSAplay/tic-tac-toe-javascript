document.querySelector(".btn-reset").addEventListener("click", resetGame);

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
let turn = "x";
let squaresUsed = [];
let board = [
  [-1, -1, -1],
  [-1, -1, -1],
  [-1, -1, -1],
];

function startGame() {
  requestAnimationFrame(checkWinner);
}

function resetGame() {
  // cambiar lo de resetar la tabla
  document.querySelectorAll(".square").forEach((square) => {
    if (square.hasChildNodes()) {
      let clase = square.children[0].className;
      square.querySelector(`.${clase}`).style.animation = "";
      void square.querySelector(`.${clase}`).offsetWidth;
      square.querySelector(`.${clase}`).style.animation =
        "exit 200ms ease both";
      square.style.backgroundColor = "";
      setTimeout(() => {
        square.innerHTML = "";
      }, SQUARE_EXIT_ANIMATION_DURATION);
    }
  });
  turn = selectTurn();
}

function selectTurn() {
  return Math.round(Math.random(1)) == 0 ? "x" : "o";
}

function checkWinner() {
  requestAnimationFrame(checkWinner);
}

function draw(squareId) {
  if (squaresUsed.includes(squareId)) {
    // mostrar mensaje que no puedes sobreescribir un turno
  } else {
    const square = document.querySelector(`#square-${squareId}`);
    square.innerHTML = turn == "x" ? X_HTML : O_HTML;
    square.style.backgroundColor =
      turn == "x" ? X_SQUARE_COLOR : O_SQUARE_COLOR;

    // Agregar cuadro en la matriz

    turn = turn == "x" ? "o" : "x";
  }
}
