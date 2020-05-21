import AI from "./AI";
import Board from "./Board";
import Canvas from "./Canvas";
import Grid from "./Grid";

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

  handleClick(x: number, y: number) {
    if (this.board.hasWinner()) {
      this.reset();
      return;
    }

    this.chooseSquare(x, y);

    if (this.ai) {
      this.chooseSquare(...Grid.fromSquareId(this.ai.pickSquare()));
    }
  }

  private chooseSquare(x: number, y: number) {
    try {
      this.board.setSquare(Grid.toSquareId(x, y));
      const squareValue = this.board.getSquare(Grid.toSquareId(x, y));
      if (squareValue === "X") {
        this.canvas.renderCross(x, y);
      } else if (squareValue === "O") {
        this.canvas.renderCircle(x, y);
      }

      if (this.board.hasWinner()) {
        const winningLine = this.board.getWinningLine();
        let [x, y] = Grid.fromSquareId(winningLine[0]);
        const startPos = { x, y };
        [x, y] = Grid.fromSquareId(winningLine[2]);
        const endPos = { x, y };

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
