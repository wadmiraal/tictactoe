import Board from "./Board";
import Grid from "./Grid";

jest.mock("./Board");

it("converts from coordinates to squareId", () => {
  expect(Grid.toSquareId(0, 0)).toBe(1);
  expect(Grid.toSquareId(2, 2)).toBe(9);
});

it("converts from squareId to coords", () => {
  expect(Grid.fromSquareId(1)).toEqual([0, 0]);
  expect(Grid.fromSquareId(9)).toEqual([2, 2]);
});

it("fetches all unplayed squares from a board", () => {
  const board = new Board();
  const boardMock = (Board as jest.Mock).mock.instances[0];
  boardMock.getSquare = jest.fn((id: number) =>
    [1, 2, 3, 4, 5].includes(id) ? "X" : undefined
  );
  expect(Grid.getAvailableSquareIds(board)).toEqual([6, 7, 8, 9]);
});
