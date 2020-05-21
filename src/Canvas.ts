import Board from "./board";

export default class Canvas {
  private element: HTMLElement;
  private board: Board;
  private context: CanvasRenderingContext2D;

  constructor(element: HTMLElement, board: Board) {
    this.element = element;
    this.board = board;
    board.setSquare(1);
    board.setSquare(5);
    this.init();
    this.render();
  }

  private init() {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", "300");
    canvas.setAttribute("height", "300");
    this.element.append(canvas);
    this.context = canvas.getContext("2d");
  }

  render() {
    const gridSize = 100;
    let squareId = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const xPos = x * gridSize;
        const yPos = y * gridSize;
        this.context.strokeRect(xPos, yPos, gridSize, gridSize);

        const square = this.board.getSquare(squareId);
        if (square !== undefined) {
          this.context.fillText(
            square,
            xPos - gridSize / 2,
            yPos - gridSize / 2
          );
        }
        squareId++;
      }
    }
  }
}
