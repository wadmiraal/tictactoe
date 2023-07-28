import Board from "../Board";
import { AiSolution } from "../types";

export default class Ai {
  constructor(_board: Board) {}

  minimax(_board: Board, _maximizing: boolean): AiSolution {
    return AiSolution.Draw;
  }

  pickSquare = jest.fn(() => {
    return 3;
  });
}
