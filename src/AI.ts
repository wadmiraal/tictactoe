import Board from "./Board";
import { AiSolution, SquareId } from "./types";

export default class Ai {
  private board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  minimax(board: Board, maximizing: boolean): AiSolution {
    if (board.hasWinner()) {
      return board.getWinner() === "X" ? AiSolution.XWins : AiSolution.OWins;
    }

    const available = board.getAvailableSquares();
    if (available.length === 0) {
      return AiSolution.Draw;
    }

    if (maximizing) {
      return available.reduce((acc, squareId) => {
        return Math.max(
          acc,
          this.minimax(board.clone().setSquare(squareId), false)
        );
      }, -Infinity);
    } else {
      return available.reduce((acc, squareId) => {
        return Math.min(
          acc,
          this.minimax(board.clone().setSquare(squareId), true)
        );
      }, Infinity);
    }
  }

  pickSquare(): SquareId {
    let pick;
    // If last player is O, we're X. And vice-versa.
    const isX = this.board.getLastPlayer() === "O";
    const desiredSolution = isX ? AiSolution.XWins : AiSolution.OWins;
    const possibleTuples: [
      SquareId,
      AiSolution
    ][] = this.board.getAvailableSquares().map((squareId) => {
      return [
        squareId,
        this.minimax(this.board.clone().setSquare(squareId), !isX),
      ];
    });

    // If there's a winning solution, choose it.
    pick = possibleTuples.find(([_, solution]) => solution === desiredSolution);
    if (pick) {
      return pick[0];
    }

    // Else, prefer a draw.
    pick = possibleTuples.find(([_, solution]) => solution === AiSolution.Draw);
    if (pick) {
      return pick[0];
    }

    // Otherwise, just pick the first one of the list.
    return possibleTuples[0][0];
  }
}
