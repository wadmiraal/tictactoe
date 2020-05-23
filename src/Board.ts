import { Player, SquareId } from "./types";

export default class Board {
  private squares: { [x in SquareId]?: Player };
  private lastPlayer: Player;
  private winningLine?: SquareId[];

  constructor() {
    this.initSquares();
  }

  private initSquares() {
    this.squares = {
      1: undefined,
      2: undefined,
      3: undefined,
      4: undefined,
      5: undefined,
      6: undefined,
      7: undefined,
      8: undefined,
      9: undefined,
    };
  }

  getCurrentPlayer() {
    let nextValue: Player;
    if (this.lastPlayer === undefined) {
      nextValue = "X";
    } else {
      nextValue = this.lastPlayer === "X" ? "O" : "X";
    }
    return (this.lastPlayer = nextValue);
  }

  getSquare(n: SquareId): Player | undefined {
    return this.squares[n];
  }

  setSquare(n: SquareId) {
    if (this.getSquare(n) === undefined) {
      this.squares[n] = this.getCurrentPlayer();
    } else {
      throw new Error(`${n} already has a value`);
    }
    return this;
  }

  hasWinner() {
    const lines: SquareId[][] = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 5, 9],
      [7, 5, 3],
    ];

    for (const line of lines) {
      const result = line.reduce((acc, squareId, i, squareIds) => {
        if (i === 0) {
          return this.getSquare(squareId) !== undefined;
        }

        if (!acc) {
          return false;
        }

        const valueA = this.getSquare(squareId);
        const valueB = this.getSquare(squareIds[i - 1]);

        return valueB !== undefined && valueA === valueB;
      }, false);

      if (result) {
        this.winningLine = line;
        return true;
      }
    }

    return false;
  }

  getWinner(): Player | undefined {
    const winningLine = this.getWinningLine();
    return winningLine !== undefined
      ? this.getSquare(winningLine[0])
      : undefined;
  }

  getWinningLine(): SquareId[] | undefined {
    if (this.winningLine === undefined) {
      // Run the winner detection.
      this.hasWinner();
    }
    return this.winningLine;
  }

  getAvailableSquares(): SquareId[] {
    return Object.keys(this.squares)
      .map(
        (key: string): SquareId => {
          // TS complains that number is not castable to SquareId. Use any to
          // get around the problem.
          const squareId: any = Number(key);
          return squareId as SquareId;
        }
      )
      .map((squareId: SquareId) => {
        return this.getSquare(squareId) === undefined ? squareId : undefined;
      })
      .filter((value) => value !== undefined);
  }

  reset() {
    this.initSquares();
    this.winningLine = undefined;
    this.lastPlayer = undefined;
    return this;
  }
}
