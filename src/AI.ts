import Board from "./Board";
import Grid from "./Grid";

export default class AI {
  private board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  pickSquare(): number {
    // Pick randomly for now.
    const available = Grid.getAvailableSquareIds(this.board);
    return available[Math.floor(Math.random() * available.length)];
  }
}
