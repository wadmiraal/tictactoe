import { GridPos, SquareId } from "./types";

const GRID: SquareId[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const GridHelper = {
  fromSquareId: (squareId: SquareId): [GridPos, GridPos] => {
    for (const y in GRID) {
      for (const x in GRID[y]) {
        if (GRID[y][x] === squareId) {
          return [Number(x) as GridPos, Number(y) as GridPos];
        }
      }
    }
  },

  toSquareId: (x: GridPos, y: GridPos) => {
    return GRID[y][x];
  },
};

export default GridHelper;
