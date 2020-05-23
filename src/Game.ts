import AI from "./AI";
import Board from "./Board";
import Canvas from "./Canvas";
import GridHelper from "./GridHelper";
import { GridPos } from "./types";

export default class Game {
  private ai?: AI;
  private board: Board;
  private canvas: Canvas;

  constructor(element: HTMLElement, againstAI = false) {
    this.board = new Board();
    this.ai = againstAI ? new AI(this.board) : undefined;
    this.canvas = new Canvas(element);
    this.canvas.onClick(this.handleClick.bind(this));
    this.canvas.renderGrid();
  }

  handleClick(x: GridPos, y: GridPos) {
    if (
      this.board.hasWinner() ||
      this.board.getAvailableSquares().length === 0
    ) {
      this.reset();
      return;
    }

    this.chooseSquare(x, y);

    if (this.ai) {
      this.chooseSquare(...GridHelper.fromSquareId(this.ai.pickSquare()));
    }
  }

  private chooseSquare(x: GridPos, y: GridPos) {
    try {
      this.board.setSquare(GridHelper.toSquareId(x, y));
      const squareValue = this.board.getSquare(GridHelper.toSquareId(x, y));
      if (squareValue === "X") {
        this.canvas.renderCross(x, y);
      } else if (squareValue === "O") {
        this.canvas.renderCircle(x, y);
      }

      if (this.board.hasWinner()) {
        const winningLine = this.board.getWinningLine();
        const [startX, startY] = GridHelper.fromSquareId(winningLine[0]);
        const [endX, endY] = GridHelper.fromSquareId(winningLine[2]);
        this.canvas.renderWinningLine(startX, startY, endX, endY);
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
