export type SquareValue = "X" | "O";

export default class Board {
  private squares: SquareValue[];
  private lastValue: SquareValue;

  constructor() {
    this.squares = new Array(9);
  }

  private getNextValue() {
    let nextValue: SquareValue;
    if (this.lastValue === undefined) {
      nextValue = "X";
    } else {
      nextValue = this.lastValue === "X" ? "O" : "X";
    }
    return (this.lastValue = nextValue);
  }

  getSquare(n: number) {
    if (n < 0 || n > 8) {
      throw new RangeError(`${n} is out of bounds (can only be 0 - 8)`);
    }
    return this.squares[n];
  }

  setSquare(n: number) {
    if (this.getSquare(n) === undefined) {
      this.squares[n] = this.getNextValue();
    } else {
      throw new Error(`${n} already has a value`);
    }
    return this;
  }

  hasWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [6, 4, 2],
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
        return true;
      }
    }

    return false;
  }
}
