import Board from "./Board";

const GRID = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const GridHelper = {
  fromSquareId: (squareId: number): [number, number] => {
    for (const y in GRID) {
      for (const x in GRID[y]) {
        if (GRID[y][x] === squareId) {
          return [Number(x), Number(y)];
        }
      }
    }
  },

  toSquareId: (x: number, y: number) => {
    return GRID[y][x];
  },

  getAvailableSquareIds: (board: Board) => {
    const available = [];
    for (const y in GRID) {
      for (const x in GRID[y]) {
        const squareId = GRID[y][x];
        if (board.getSquare(squareId) === undefined) {
          available.push(squareId);
        }
      }
    }
    return available;
  },
};

export default GridHelper;
