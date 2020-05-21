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
        if (n < 0 || n > 8) {
            throw new RangeError(`${n} is out of bounds (can only be 0 - 8)`);
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
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [6, 4, 2],
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
                return true;
            }
        }
        return false;
    }
}
exports.default = Board;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Canvas {
    constructor(element, board) {
        this.element = element;
        this.board = board;
        board.setSquare(1);
        board.setSquare(5);
        this.init();
        this.render();
    }
    init() {
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
                    this.context.fillText(square, xPos - gridSize / 2, yPos - gridSize / 2);
                }
                squareId++;
            }
        }
    }
}
exports.default = Canvas;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = require("./Board");
const Canvas_1 = require("./Canvas");
const canvas = new Canvas_1.default(document.getElementById("game"), new Board_1.default());

},{"./Board":1,"./Canvas":2}]},{},[3]);
