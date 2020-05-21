(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Board {
    constructor() {
        this.squares = new Array(9);
    }
    getNextValue() {
        let nextValue;
        if (this.lastValue === undefined) {
            nextValue = "X";
        }
        else {
            nextValue = this.lastValue === "X" ? "O" : "X";
        }
        return (this.lastValue = nextValue);
    }
    getSquare(n) {
        if (n < 1 || n > 9) {
            throw new RangeError(`${n} is out of bounds (can only be 1 - 9)`);
        }
        return this.squares[n];
    }
    setSquare(n) {
        if (this.getSquare(n) === undefined) {
            this.squares[n] = this.getNextValue();
        }
        else {
            throw new Error(`${n} already has a value`);
        }
        return this;
    }
    hasWinner() {
        const lines = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 5, 9],
            [7, 5, 3],
        ];
        for (const line of lines) {
            const result = line.reduce((acc, squareId, i, squareIds) => {
                if (i === 0) {
                    return this.getSquare(squareId) !== undefined;
                }
                if (!acc) {
                    return false;
                }
                const valueA = this.getSquare(squareId);
                const valueB = this.getSquare(squareIds[i - 1]);
                return valueB !== undefined && valueA === valueB;
            }, false);
            if (result) {
                this.winningLine = line;
                return true;
            }
        }
        return false;
    }
    getWinner() {
        if (this.winningLine) {
            return this.getSquare(this.winningLine[0]);
        }
    }
    getWinningLine() {
        return this.winningLine;
    }
    reset() {
        this.squares = new Array(9);
        this.winningLine = undefined;
        return this;
    }
}
exports.default = Board;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GRID_SIZE = 100;
const PADDING = 10;
class Canvas {
    constructor(element) {
        this.element = element;
        this.init();
    }
    onClick(onClickCallback) {
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
                const [xPos, yPos] = this.getPositions(x, y);
                this.context.strokeRect(xPos + 1, yPos + 1, GRID_SIZE, GRID_SIZE);
            }
        }
    }
    renderCircle(x, y) {
        const [xPos, yPos] = this.getPositions(x, y);
        const radius = (GRID_SIZE - PADDING * 2) / 2;
        this.context.beginPath();
        this.context.lineWidth = 3;
        this.context.strokeStyle = "blue";
        this.context.arc(xPos + radius + PADDING, yPos + radius + PADDING, radius, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.closePath();
    }
    renderCross(x, y) {
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
    renderWinningLine(startX, startY, endX, endY) {
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
    init() {
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width", "302");
        this.canvas.setAttribute("height", "302");
        this.element.append(this.canvas);
        this.context = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", this.handleClick.bind(this));
    }
    handleClick(e) {
        if (this.onClickCallback) {
            const x = Math.floor((e.clientX - this.canvas.offsetLeft) / GRID_SIZE);
            const y = Math.floor((e.clientY - this.canvas.offsetTop) / GRID_SIZE);
            this.onClickCallback(x, y);
        }
    }
    getPositions(x, y) {
        return [Number(x) * GRID_SIZE, Number(y) * GRID_SIZE];
    }
}
exports.default = Canvas;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = require("./Board");
const Canvas_1 = require("./Canvas");
const GRID = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];
class Game {
    constructor(element) {
        this.board = new Board_1.default();
        this.canvas = new Canvas_1.default(element);
        this.canvas.onClick(this.handleClick.bind(this));
        this.canvas.renderGrid();
    }
    handleClick(x, y) {
        if (this.board.hasWinner()) {
            this.reset();
            return;
        }
        try {
            this.board.setSquare(GRID[y][x]);
            const squareValue = this.board.getSquare(GRID[y][x]);
            if (squareValue === "X") {
                this.canvas.renderCross(x, y);
            }
            else if (squareValue === "O") {
                this.canvas.renderCircle(x, y);
            }
            if (this.board.hasWinner()) {
                const winningLine = this.board.getWinningLine();
                let startPos;
                let endPos;
                for (const y in GRID) {
                    for (const x in GRID[y]) {
                        const squareId = GRID[y][x];
                        if (winningLine[0] === squareId) {
                            startPos = { x, y };
                        }
                        else if (winningLine[2] === squareId) {
                            endPos = { x, y };
                        }
                    }
                }
                this.canvas.renderWinningLine(Number(startPos.x), Number(startPos.y), Number(endPos.x), Number(endPos.y));
            }
        }
        catch (e) {
        }
    }
    reset() {
        this.board.reset();
        this.canvas.reset();
    }
}
exports.default = Game;

},{"./Board":1,"./Canvas":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./Game");
const canvas = new Game_1.default(document.getElementById("game"));

},{"./Game":3}]},{},[4]);
