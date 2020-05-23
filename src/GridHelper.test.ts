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
