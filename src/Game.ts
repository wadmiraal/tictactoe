import Board from "./Board";
import Canvas from "./Canvas";

const GRID = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

export default class Game {
  private board: Board;
  private canvas: Canvas;

  constructor(element: HTMLElement) {
    this.board = new Board();
    this.canvas = new Canvas(element);
    this.canvas.onClick(this.handleClick.bind(this));
    this.canvas.renderGrid();
  }

  handleClick(x: number, y: number) {
    if (this.board.hasWinner()) {
      this.reset();
      return;
    }

    try {
      this.board.setSquare(GRID[y][x]);
      const squareValue = this.board.getSquare(GRID[y][x]);
      if (squareValue === "X") {
        this.canvas.renderCross(x, y);
      } else if (squareValue === "O") {
        this.canvas.renderCircle(x, y);
      }

      if (this.board.hasWinner()) {
        const winningLine = this.board.getWinningLine();
        let startPos;
        let endPos;
        for (const y in GRID) {
          for (const x in GRID[y]) {
            const squareId = GRID[y][x];
            if (winningLine[0] === squareId) {
              startPos = { x, y };
            } else if (winningLine[2] === squareId) {
              endPos = { x, y };
            }
          }
        }
        this.canvas.renderWinningLine(
          Number(startPos.x),
          Number(startPos.y),
          Number(endPos.x),
          Number(endPos.y)
        );
      }
    } catch (e) {
      /* noop */
    }
  }

  private reset() {
    this.board.reset();
    this.canvas.reset();
  }
}
