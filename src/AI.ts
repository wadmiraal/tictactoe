import Board from "./Board";
import { SquareId } from "./types";

export default class AI {
  private board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  pickSquare(): SquareId {
    // Pick randomly for now.
    const available = this.board.getAvailableSquares();
    return available[Math.floor(Math.random() * available.length)];
  }
}
