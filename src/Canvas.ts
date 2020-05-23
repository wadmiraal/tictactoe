import { GridPos } from "./types";

const GRID_SIZE = 100;
const PADDING = 10;

export default class Canvas {
  private element: HTMLElement;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private onClickCallback: (x: GridPos, y: GridPos) => void;

  constructor(element: HTMLElement) {
    this.element = element;
    this.init();
  }

  onClick(onClickCallback: (x: GridPos, y: GridPos) => void) {
    this.onClickCallback = onClickCallback;
  }

  reset() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderGrid();
  }

  renderGrid() {
    this.context.lineWidth = 1;
    this.context.strokeStyle = "black";
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const [xPos, yPos] = this.getPositions(x as GridPos, y as GridPos);
        this.context.strokeRect(xPos + 1, yPos + 1, GRID_SIZE, GRID_SIZE);
      }
    }
  }

  renderCircle(x: GridPos, y: GridPos) {
    const [xPos, yPos] = this.getPositions(x, y);

    const radius = (GRID_SIZE - PADDING * 2) / 2;
    this.context.beginPath();
    this.context.lineWidth = 3;
    this.context.strokeStyle = "blue";
    this.context.arc(
      xPos + radius + PADDING,
      yPos + radius + PADDING,
      radius,
      0,
      2 * Math.PI
    );
    this.context.stroke();
    this.context.closePath();
  }

  renderCross(x: GridPos, y: GridPos) {
    const [xPos, yPos] = this.getPositions(x, y);

    const xLineStartPos = xPos + PADDING;
    const xLineEndPos = xPos + GRID_SIZE - PADDING;
    const yLineStartPos = yPos + PADDING;
    const yLineEndPos = yPos + GRID_SIZE - PADDING;

    this.context.beginPath();
    this.context.lineWidth = 3;
    this.context.strokeStyle = "orange";
    this.context.moveTo(xLineStartPos, yLineStartPos);
    this.context.lineTo(xLineEndPos, yLineEndPos);
    this.context.moveTo(xLineStartPos, yLineEndPos);
    this.context.lineTo(xLineEndPos, yLineStartPos);
    this.context.stroke();
    this.context.closePath();
  }

  renderWinningLine(
    startX: GridPos,
    startY: GridPos,
    endX: GridPos,
    endY: GridPos
  ) {
    const halfGridSize = GRID_SIZE / 2;
    const xLineStartPos = Number(startX) * GRID_SIZE + halfGridSize;
    const yLineStartPos = Number(startY) * GRID_SIZE + halfGridSize;
    const xLineEndPos = Number(endX) * GRID_SIZE + halfGridSize;
    const yLineEndPos = Number(endY) * GRID_SIZE + halfGridSize;

    this.context.beginPath();
    this.context.lineWidth = 4;
    this.context.strokeStyle = "red";
    this.context.moveTo(xLineStartPos, yLineStartPos);
    this.context.lineTo(xLineEndPos, yLineEndPos);
    this.context.stroke();
    this.context.closePath();
  }

  private init() {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("width", "302");
    this.canvas.setAttribute("height", "302");
    this.element.append(this.canvas);
    this.context = this.canvas.getContext("2d");
    this.canvas.addEventListener("click", this.handleClick.bind(this));
  }

  private handleClick(e: MouseEvent) {
    if (this.onClickCallback) {
      const x = Math.floor(
        (e.clientX - this.canvas.offsetLeft) / GRID_SIZE
      ) as GridPos;
      const y = Math.floor(
        (e.clientY - this.canvas.offsetTop) / GRID_SIZE
      ) as GridPos;
      this.onClickCallback(x, y);
    }
  }

  private getPositions(x: GridPos, y: GridPos) {
    return [Number(x) * GRID_SIZE, Number(y) * GRID_SIZE];
  }
}
