import Canvas from "./Canvas";
import Game from "./Game";

jest.mock("./AI");
jest.mock("./Board");
jest.mock("./Canvas");

beforeEach(jest.clearAllMocks);

it("correctly initalizes the game", () => {
  new Game(document.createElement("div"));
  const canvasMock = (Canvas as jest.Mock).mock.instances[0];
  expect(canvasMock.onClick).toHaveBeenCalled();
  expect(canvasMock.renderGrid).toHaveBeenCalled();
});

it("correctly handles clicking squares", () => {
  const game = new Game(document.createElement("div"));
  const board = game.getBoard();
  const canvasMock = (Canvas as jest.Mock).mock.instances[0];

  board.getSquare = jest.fn((id: number) => {
    if (id === 1) {
      return "X";
    }
    if (id === 9) {
      return "O";
    }
  });

  game.handleClick(0, 0);
  expect(board.setSquare).toHaveBeenCalledWith(1);
  expect(canvasMock.renderCross).toHaveBeenCalledWith(0, 0);

  game.handleClick(2, 2);
  expect(board.setSquare).toHaveBeenCalledWith(9);
  expect(canvasMock.renderCircle).toHaveBeenCalledWith(2, 2);
});

it("correctly handles AI turn", () => {
  const game = new Game(document.createElement("div"), true);
  const spy = jest.spyOn<any, any>(game, "chooseSquare");
  const board = game.getBoard();
  const ai = game.getAi();

  board.getAvailableSquares = jest.fn(() => [2, 3]);
  ai.pickSquare = jest.fn(() => 1);
  game.handleClick(1, 1);
  expect(ai.pickSquare).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith(1, 1);
  expect(spy).toHaveBeenCalledWith(0, 0);
});

it("correctly handles winning conditions", () => {
  const game = new Game(document.createElement("div"));
  const board = game.getBoard();
  const canvasMock = (Canvas as jest.Mock).mock.instances[0];

  let hasWinner = false;
  board.getAvailableSquares = jest.fn(() => [2, 3]);
  board.hasWinner = jest.fn(() => {
    hasWinner = !hasWinner;
    return !hasWinner;
  });
  board.getWinningLine = jest.fn(() => [1, 5, 9]);

  game.handleClick(0, 0);
  expect(board.hasWinner).toHaveBeenCalledTimes(4);
  expect(canvasMock.renderWinningLine).toHaveBeenCalledWith(0, 0, 2, 2);
});

it("correctly resets if game is won", () => {
  const game = new Game(document.createElement("div"));
  const board = game.getBoard();
  const canvasMock = (Canvas as jest.Mock).mock.instances[0];

  board.hasWinner = jest.fn(() => true);

  game.handleClick(0, 0);
  expect(board.reset).toHaveBeenCalled();
  expect(canvasMock.reset).toHaveBeenCalled();
});

it("correctly resets if game is a draw", () => {
  const game = new Game(document.createElement("div"));
  const board = game.getBoard();
  const canvasMock = (Canvas as jest.Mock).mock.instances[0];

  board.getAvailableSquares = jest.fn(() => []);
  game.handleClick(0, 0);
  expect(board.reset).toHaveBeenCalled();
  expect(canvasMock.reset).toHaveBeenCalled();
});
