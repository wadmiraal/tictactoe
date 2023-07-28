import { Player, SquareId } from "../types";

type Squares = { [x in SquareId]?: Player };

export default class Board {
  constructor(_squares?: Squares, _lastPlayer?: Player) {}

  clone() {
    return new Board();
  }

  getLastPlayer() {
    return "O";
  }

  getSquare = jest.fn((_n: SquareId) => {
    return "X";
  });

  setSquare = jest.fn((_n: SquareId) => {
    return this;
  });

  hasWinner = jest.fn(() => {
    return false;
  });

  getWinner(): Player | undefined {
    return "X";
  }

  getWinningLine(): SquareId[] | undefined {
    return [1, 2, 3];
  }

  getAvailableSquares = jest.fn(() => {
    return [2, 3];
  });

  reset = jest.fn(() => {
    return this;
  });
}
