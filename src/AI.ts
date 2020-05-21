import Board from "./Board";
import GridHelper from "./GridHelper";

export default class AI {
  private board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  pickSquare(): number {
    // Pick randomly for now.
    const available = GridHelper.getAvailableSquareIds(this.board);
    return available[Math.floor(Math.random() * available.length)];
  }
}
