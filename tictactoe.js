/**
 * TicTacToe 1.0
 *
 * Copyright (c) 2011 Wouter Admiraal (http://github.com/wadmiraal)
 *  
 * Licensed under the MIT license: http://opensource.org/licenses/MIT
 */

/**
 * Constructor
 *
 * @param {Object} options
 * 				The options map. Must contain the 'cssClass' property for
 * 				finding the squares. Optional properties:
 * 				 - 'againstHuman': defaults to false. If true, AI will be turned off
 * 				 - 'scoreWrappers': can contain 2 properties:
 * 				 		- 'cross': the css ID for the cross player
 * 				 		- 'circle': the css ID for the circle player
 */
function TicTacToe(options) {
	if (!options.cssClass) {
		throw Error('Must provide a CSS Class for the squares !');
	}

  this.cssClass = options.cssClass;
  this.againstHuman = options.againstHuman ? true : false;
  this.CROSS = 'cross';
  this.CIRCLE = 'circle';
	this.scoreWrapper = {
		'cross':  options.scoreWrappers.cross  ? document.getElementById(options.scoreWrappers.cross)  : null,
		'circle': options.scoreWrappers.circle ? document.getElementById(options.scoreWrappers.circle) : null
	};
	this.score = { 'cross': 0, 'circle': 0 };
  this.currentPlayer = Math.round(Math.random()) ? this.CROSS : this.CIRCLE;
  this.computerColor = Math.round(Math.random()) ? this.CROSS : this.CIRCLE;
	this.lines = [
		['TL', 'TM', 'TR'],
		['CL', 'CM', 'CR'],
		['BL', 'BM', 'BR'],
		['TL', 'CL', 'BL'],
		['TM', 'CM', 'BM'],
		['TR', 'CR', 'BR'],
		['TL', 'CM', 'BR'],
		['TR', 'CM', 'BL']
	];
	
  this.getSquares();
	
	this.reset();
}

/**
 * Reset the game.
 */
TicTacToe.prototype.reset = function(wait) {
	this.round     = 0;
  this.topRow    = [];
  this.centerRow = [];
  this.bottomRow = [];
  this.leftCol   = [];
  this.middleCol = [];
  this.rightCol  = [];
  this.diagonal1 = [];
  this.diagonal2 = [];
  this.squareMap = {};
	this.arrays = [this.topRow, this.centerRow, this.bottomRow, this.leftCol, this.middleCol, this.rightCol, this.diagonal1, this.diagonal2];
	
	var oldClass, regExp = new RegExp('(?:^|\\s)(' + this.CROSS + '|' + this.CIRCLE + ')(?:$|\\s)');
	
	for (var i = 0; i < 9; ++i) {
		oldClass = this.squares[i].getAttribute('class');
		
		this.squares[i].setAttribute('class', oldClass.replace(regExp, ''));
	}
	
	if (this.currentPlayer == this.computerColor) {
    this.play();
  }
}

/**
 * Get all squares and attach event listeners.
 */
TicTacToe.prototype.getSquares = function() {
  var squares;
  
  if (document.getElementsByClassName) {
    squares = document.getElementsByClassName(this.cssClass);
  }
  else {
    var hasClassName = new RegExp('(?:^|\\s)' + this.cssClass + '(?:$|\\s)'),
        allElements  = document.getElementsByTagName('*')
        element,
        elementClass;
    
    squares = new Array();
		
    for (var i = 0; (element = allElements[i]) != null; i++) {
			elementClass = element.className;
      
			if (elementClass && elementClass.indexOf(className) != -1 && hasClassName.test(elementClass)) {
				squares.push(element);
			}
		}
  }
  
  this.squares = squares;
  
  this.addEventListeners();
}

/**
 * Add event listeners to all squares.
 */
TicTacToe.prototype.addEventListeners = function() {
  for (var i = 0, len = this.squares.length; i < len; ++i) {
    (function(ticTacToe, square) {
      square.addEventListener('click', function() {
        ticTacToe.click(this);
      }, false);
    })(this, this.squares[i])
  }
}

/**
 * Square click handler.
 * Stores the clicked square and switches the player.
 *
 * @see TicTacToe.store()
 *
 * @param {Object} element
 * 				The clicked square
 */
TicTacToe.prototype.click = function(element) {
  if (!this.squareMap[element.id]) {    
    if (this.store(element.id, this.currentPlayer)) {
			this.changePlayer();
		}
  }
  else {
    alert('already played');
  }
  
  return false;
}

/**
 * Stores the last clicked square.
 * If more then 4 squares have been clicked, will
 * check if there's a winner.
 *
 * @see TicTacToe.win()
 *
 * @param {String} id
 * 				The id of the clicked square. Must be of "TL", "CL", "BL", "TM", etc
 * @param {String} color
 * 				The player that clicked on the square
 *
 * @returns {Boolean}
 * 				True if the game can go on, false otherwise
 */
TicTacToe.prototype.store = function(id, color) {
  this.squareMap[id] = color;
  
  var element = document.getElementById(id);
	element.setAttribute('class' , element.getAttribute('class') + ' ' + color);
	
	var linesToCheck;
	
  switch(id) {
    case 'TL':
      this.topRow.push(id);
      this.leftCol.push(id);
      this.diagonal1.push(id);
			
			linesToCheck = [this.topRow, this.leftCol, this.diagonal1];
      break;
    
    case 'TM':
      this.topRow.push(id);
      this.middleCol.push(id);
			
			linesToCheck = [this.topRow, this.middleCol];
      break;
    
    case 'TR':
      this.topRow.push(id);
      this.rightCol.push(id);
      this.diagonal2.push(id);
			
			linesToCheck = [this.topRow, this.rightCol, this.diagonal2];
      break;
    
    case 'CL':
      this.centerRow.push(id);
      this.leftCol.push(id);
			
			linesToCheck = [this.centerRow, this.leftCol];
      break;
    
    case 'CM':
      this.centerRow.push(id);
      this.middleCol.push(id);
      this.diagonal1.push(id);
      this.diagonal2.push(id);
			
			linesToCheck = [this.centerRow, this.middleCol, this.diagonal1, this.diagonal2];
      break;
    
    case 'CR':
      this.centerRow.push(id);
      this.rightCol.push(id);
			
			linesToCheck = [this.centerRow, this.rightCol];
      break;
    
    case 'BL':
      this.bottomRow.push(id);
      this.leftCol.push(id);
      this.diagonal2.push(id);
			
			linesToCheck = [this.bottomRow, this.leftCol, this.diagonal2];
      break;
    
    case 'BM':
      this.bottomRow.push(id);
      this.middleCol.push(id);
			
			linesToCheck = [this.bottomRow, this.middleCol];
      break;
    
    case 'BR':
      this.bottomRow.push(id);
      this.rightCol.push(id);
      this.diagonal1.push(id);
			
			linesToCheck = [this.bottomRow, this.rightCol, this.diagonal1];
      break;
		
		default:
			console.log("No valid id received !\nId: " + id);
			break;
  }
	
	this.round++;
	
	if (this.round > 4) {
		return !this.win(linesToCheck);
	}
	else {
		return true;
	}
}

/**
 * Change the player.
 * If playing against the AI, will trigger the AI move.
 *
 * @see TicTacToe.play()
 */
TicTacToe.prototype.changePlayer = function() {
  this.currentPlayer = this.currentPlayer == this.CROSS ? this.CIRCLE : this.CROSS;
  
  if (!this.againstHuman && this.currentPlayer == this.computerColor) {
    this.play();
  }
}

/**
 * AI move.
 * Checks for available squares and plays accordingly.
 *
 * @see TicTacToe.defensivePlacement()
 * @see TicTacToe.offensivePlacement()
 */
TicTacToe.prototype.play = function() {
	var chosen, pos = this.defensivePlacement(), placeOffensively = false;
	
	if (pos.possible.length == 0) console.log(pos);
	
	if (pos.must || pos.win) {
		// Defensive/win placement
		if (pos.win) {
			chosen = pos.win;
		}
		else {
			chosen = pos.must;
		}
	}
	else if (placeOffensively) {
		// Offensive placement
		this.offensivePlacement(pos.possible);
	}
	else {
		// Passive placement. Go to a random free square
		console.log(Math.round(Math.random() * pos.possible.length - 1));
		console.log(pos);
		chosen = pos.possible[Math.round(Math.random() * pos.possible.length - 1)];
		console.log(chosen);
		
		if (chosen == undefined) {
			console.log(this.arrays);
		}
	}
  
  if (this.store(chosen, this.currentPlayer)) {
		this.changePlayer();
	}
}

/**
 * Check for available squares.
 * If a row contains 2 squares of the same color and both are of
 * the same color as the AI, store the last square in 'win' and return
 * immediatly. If both are of the same color as the human player, store it in
 * 'must', but continue searching, because we might still come accros a 'win'.
 * If the row contains 2 or less squares of different colors, store in the
 * 'possible' array.
 *
 * @see TicTacToe.play()
 *
 * @returns {Object}
 * 				An object with properties: 'win', 'must' and 'possible'
 */
TicTacToe.prototype.defensivePlacement = function() {
  var pos = { 'must': null, 'win': null, 'possible': [] };
  
  for (var i = 0, len = this.arrays.length; i < len; ++i) {
		// If there are exactly 2 elements in this line and both have the same color, this is a win|must position
		if (this.arrays[i].length == 2 && this.squareMap[this.arrays[i][0]] == this.squareMap[this.arrays[i][1]]) {
			for (var j = 0; j < 3; ++j) {
				// Check wich position is still free
				if (!this.squareMap[this.lines[i][j]]) {
					// If this is our color, we win. Else, we'll have to place here
					// to avoid losing
					if (this.squareMap[this.arrays[i][0]] == this.computerColor) {
						pos.win = this.lines[i][j];
						
						return pos;
					}
					else if(this.squareMap[this.arrays[i][0]]) {
						pos.must = this.lines[i][j];
					}
				}
			}
		}
		// Else, these are only possible placements
		else if (this.arrays[i].length <= 2) {
			console.log(this.arrays);
			for (var j = 0; j < 3; ++j) {
				if (!this.squareMap[this.lines[i][j]]) {
					pos.possible.push(this.lines[i][j]);
				}
			}
		}
	}
  
  return pos
}

/**
 * TODO: Figure out an algorithm to place inteligently
 *
 * @see TicTacToe.play()
 * @see TicTacToe.defensivePlacement()
 *
 * @param {Array} possible
 * 				Array of available squares
 *
 * @returns {String}
 * 				The id of the square to play
 */
TicTacToe.prototype.offensivePlacement = function(possible) {
	var position;
	
	return position;
}

/**
 * Check all lines for a win.
 * Checks all lines that contain the last selected square. If
 * the line contains 3 squares, check their color. If all 3 have
 * the same color, we have a winner.
 *
 * @param {Array} linesToCheck
 * 				The lines that contain the last checked square
 *
 * @returns {Boolean}
 * 				True in case of a win, false if not
 */
TicTacToe.prototype.win = function(linesToCheck) {	
	for (var i = 0, len = linesToCheck.length; i < len; ++i) {
		// If a line has 3 elements and all elements have the same color, there's a winner
		if (linesToCheck[i].length == 3 && this.squareMap[linesToCheck[i][0]] == this.squareMap[linesToCheck[i][1]] && this.squareMap[linesToCheck[i][0]] == this.squareMap[linesToCheck[i][2]]) {
			alert(this.squareMap[linesToCheck[i][0]] + ' wins !!');
			
			this.score[this.squareMap[linesToCheck[i][0]]]++;
			
			if (this.scoreWrapper[this.squareMap[linesToCheck[i][0]]]) {
				this.scoreWrapper[this.squareMap[linesToCheck[i][0]]].innerHTML = this.score[this.squareMap[linesToCheck[i][0]]];
			}
			
			this.reset();
			
			return true;
		}
	}
	
	// Is this a tie ?
	if (this.round == 9) {
		alert("Draw");
		
		this.changePlayer();
		
		this.reset();
	}
	
	return false;
}