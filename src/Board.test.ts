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
});

it("can detect a winning situation", () => {
  const board = new Board();

  expect(board.hasWinner()).toBe(false);

  board
    .setSquare(0) // X
    .setSquare(1) // O
    .setSquare(2) // X
    .setSquare(3) // O
    .setSquare(4) // X
    .setSquare(5) // O
    .setSquare(8); // X;
  expect(board.hasWinner()).toBe(true);
});
