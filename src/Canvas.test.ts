import Canvas from "./Canvas";

beforeEach(jest.clearAllMocks);

it("correctly initiates the canvas", () => {
  const element = document.createElement("div");
  const canvas = new Canvas(element);
  expect(getCanvas(element).tagName).toBe("CANVAS");

  const onClick = jest.fn();
  canvas.onClick(onClick);
  getCanvas(element).dispatchEvent(
    new MouseEvent("click", {
      clientX: 233,
      clientY: 20,
    })
  );
  expect(onClick).toBeCalledWith(2, 0);
});

it("correctly draws to the canvas", () => {
  const element = document.createElement("div");
  const canvas = new Canvas(element);
  const ctx = getCanvas(element).getContext("2d");

  canvas.renderGrid();
  expect(ctx.strokeRect).toBeCalledWith(1, 1, 100, 100);
  expect(ctx.strokeRect).toBeCalledWith(101, 1, 100, 100);
  expect(ctx.strokeRect).toBeCalledWith(201, 1, 100, 100);
  expect(ctx.strokeRect).toBeCalledWith(1, 101, 100, 100);
  expect(ctx.strokeRect).toBeCalledWith(101, 101, 100, 100);
  expect(ctx.strokeRect).toBeCalledWith(201, 101, 100, 100);
  expect(ctx.strokeRect).toBeCalledWith(1, 201, 100, 100);
  expect(ctx.strokeRect).toBeCalledWith(101, 201, 100, 100);
  expect(ctx.strokeRect).toBeCalledWith(201, 201, 100, 100);

  jest.clearAllMocks();

  canvas.renderCircle(0, 0);
  expect(ctx.beginPath).toBeCalled();
  expect(ctx.arc).toBeCalledWith(50, 50, 40, 0, 2 * Math.PI);
  expect(ctx.stroke).toBeCalled();
  expect(ctx.closePath).toBeCalled();

  jest.clearAllMocks();

  canvas.renderCross(2, 2);
  expect(ctx.beginPath).toBeCalled();
  expect(ctx.moveTo).toBeCalledWith(210, 210);
  expect(ctx.lineTo).toBeCalledWith(290, 290);
  expect(ctx.moveTo).toBeCalledWith(210, 290);
  expect(ctx.lineTo).toBeCalledWith(290, 210);
  expect(ctx.stroke).toBeCalled();
  expect(ctx.closePath).toBeCalled();

  jest.clearAllMocks();

  canvas.renderWinningLine(1, 0, 1, 2);
  expect(ctx.beginPath).toBeCalled();
  expect(ctx.moveTo).toBeCalledWith(150, 50);
  expect(ctx.lineTo).toBeCalledWith(150, 250);
  expect(ctx.stroke).toBeCalled();
  expect(ctx.closePath).toBeCalled();
});

it("correctly resets", () => {
  const element = document.createElement("div");
  const canvas = new Canvas(element);
  const ctx = getCanvas(element).getContext("2d");
  canvas.reset();
  expect(ctx.clearRect).toBeCalledWith(0, 0, 302, 302);
  expect(ctx.strokeRect).toBeCalled();
});

function getCanvas(element: HTMLDivElement): HTMLCanvasElement {
  return element.children.item(0) as HTMLCanvasElement;
}
