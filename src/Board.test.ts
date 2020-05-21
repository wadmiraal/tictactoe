import Board from "./Board";

it("can get/set square values", () => {
  const board = new Board();

  expect(board.getSquare(1)).toBeUndefined();

  board.setSquare(1);
  board.setSquare(8);
  expect(board.getSquare(1)).toBe("X");
  expect(board.getSquare(8)).toBe("O");

  expect(() => {
    // Out of bounds.
    board.setSquare(10);
  }).toThrow();

  expect(() => {
    // Out of bounds.
    board.getSquare(-2);
  }).toThrow();

  expect(() => {
    // Cannot override an existing square.
    board.setSquare(1);
  }).toThrow();

  // Test reset.
  board.reset();
  expect(board.getSquare(1)).toBeUndefined();
});

it("can detect a winning situation", () => {
  const board = new Board();

  expect(board.hasWinner()).toBe(false);
  expect(board.getWinner()).toBeUndefined();
  expect(board.getWinningLine()).toBeUndefined();

  board
    .setSquare(1) // X
    .setSquare(2) // O
    .setSquare(3) // X
    .setSquare(4) // O
    .setSquare(5) // X
    .setSquare(6) // O
    .setSquare(9); // X;
  expect(board.hasWinner()).toBe(true);
  expect(board.getWinner()).toBe("X");
  expect(board.getWinningLine()).toEqual([1, 5, 9]);

  // Test reset.
  board.reset();
  expect(board.hasWinner()).toBe(false);
  expect(board.getWinner()).toBeUndefined();
  expect(board.getWinningLine()).toBeUndefined();
});
