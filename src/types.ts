export type Player = "X" | "O";
export type SquareId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type GridPos = 0 | 1 | 2;
export enum AiSolution {
  XWins = 10,
  OWins = -10,
  Draw = 0,
}
