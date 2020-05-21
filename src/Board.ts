export type Player = "X" | "O";

export default class Board {
  private squares: Player[];
  private lastValue: Player;
  private winningLine?: number[];

  constructor() {
    this.squares = new Array(9);
  }

  getCurrentPlayer() {
    let nextValue: Player;
    if (this.lastValue === undefined) {
      nextValue = "X";
    } else {
      nextValue = this.lastValue === "X" ? "O" : "X";
    }
    return (this.lastValue = nextValue);
  }

  getSquare(n: number): Player | undefined {
    if (n < 1 || n > 9) {
      throw new RangeError(`${n} is out of bounds (can only be 1 - 9)`);
    }
    return this.squares[n];
  }

  setSquare(n: number) {
    if (this.getSquare(n) === undefined) {
      this.squares[n] = this.getCurrentPlayer();
    } else {
      throw new Error(`${n} already has a value`);
    }
    return this;
  }

  hasWinner() {
    const lines = [
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
    if (this.winningLine) {
      return this.getSquare(this.winningLine[0]);
    }
  }

  getWinningLine(): number[] | undefined {
    return this.winningLine;
  }

  reset() {
    this.squares = new Array(9);
    this.winningLine = undefined;
    return this;
  }
}
