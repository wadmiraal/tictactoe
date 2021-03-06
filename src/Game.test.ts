import AI from "./AI";
import Board from "./Board";
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
  const boardMock = (Board as jest.Mock).mock.instances[0];
  const canvasMock = (Canvas as jest.Mock).mock.instances[0];

  boardMock.getAvailableSquares = jest.fn(() => [2, 3]);
  boardMock.getSquare = jest.fn((id: number) => {
    if (id === 1) {
      return "X";
    }
    if (id === 9) {
      return "O";
    }
  });

  game.handleClick(0, 0);
  expect(boardMock.setSquare).toHaveBeenCalledWith(1);
  expect(canvasMock.renderCross).toHaveBeenCalledWith(0, 0);

  game.handleClick(2, 2);
  expect(boardMock.setSquare).toHaveBeenCalledWith(9);
  expect(canvasMock.renderCircle).toHaveBeenCalledWith(2, 2);
});

it("correctly handles AI turn", () => {
  const game = new Game(document.createElement("div"), true);
  const spy = jest.spyOn<any, any>(game, "chooseSquare");
  const boardMock = (Board as jest.Mock).mock.instances[0];
  const aiMock = (AI as jest.Mock).mock.instances[0];

  boardMock.getAvailableSquares = jest.fn(() => [2, 3]);
  aiMock.pickSquare = jest.fn(() => 1);
  game.handleClick(1, 1);
  expect(aiMock.pickSquare).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith(1, 1);
  expect(spy).toHaveBeenCalledWith(0, 0);
});

it("correctly handles winning conditions", () => {
  const game = new Game(document.createElement("div"));
  const boardMock = (Board as jest.Mock).mock.instances[0];
  const canvasMock = (Canvas as jest.Mock).mock.instances[0];

  let hasWinner = false;
  boardMock.getAvailableSquares = jest.fn(() => [2, 3]);
  boardMock.hasWinner = jest.fn(() => {
    hasWinner = !hasWinner;
    return !hasWinner;
  });
  boardMock.getWinningLine = jest.fn(() => [1, 5, 9]);

  game.handleClick(0, 0);
  expect(boardMock.hasWinner).toHaveBeenCalledTimes(2);
  expect(canvasMock.renderWinningLine).toHaveBeenCalledWith(0, 0, 2, 2);
});

it("correctly resets if game is won", () => {
  const game = new Game(document.createElement("div"));
  const boardMock = (Board as jest.Mock).mock.instances[0];
  const canvasMock = (Canvas as jest.Mock).mock.instances[0];

  boardMock.hasWinner = jest.fn(() => true);

  game.handleClick(0, 0);
  expect(boardMock.reset).toHaveBeenCalled();
  expect(canvasMock.reset).toHaveBeenCalled();
});

it("correctly resets if game is a draw", () => {
  const game = new Game(document.createElement("div"));
  const boardMock = (Board as jest.Mock).mock.instances[0];
  const canvasMock = (Canvas as jest.Mock).mock.instances[0];

  boardMock.getAvailableSquares = jest.fn(() => []);
  game.handleClick(0, 0);
  expect(boardMock.reset).toHaveBeenCalled();
  expect(canvasMock.reset).toHaveBeenCalled();
});
