import Board from "./Board";
import GridHelper from "./GridHelper";

jest.mock("./Board");

it("converts from coordinates to squareId", () => {
  expect(GridHelper.toSquareId(0, 0)).toBe(1);
  expect(GridHelper.toSquareId(2, 2)).toBe(9);
});

it("converts from squareId to coords", () => {
  expect(GridHelper.fromSquareId(1)).toEqual([0, 0]);
  expect(GridHelper.fromSquareId(9)).toEqual([2, 2]);
});

it("fetches all unplayed squares from a board", () => {
  const board = new Board();
  const boardMock = (Board as jest.Mock).mock.instances[0];
  boardMock.getSquare = jest.fn((id: number) =>
    [1, 2, 3, 4, 5].includes(id) ? "X" : undefined
  );
  expect(GridHelper.getAvailableSquareIds(board)).toEqual([6, 7, 8, 9]);
});
