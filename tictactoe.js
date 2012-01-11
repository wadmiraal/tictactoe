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
 * @param {Boolean} againstHuman
 * 				(optional) A boolean specifying if the player is playing against the
 * 				AI or against another human. Defaults to false.
 */
function TicTacToe(againstHuman) {	
	// Make sure we get a boolean
  this.againstHuman = !!againstHuman;
	
  this.CROSS = 'cross';
  this.CIRCLE = 'circle';
	
	this.scoreWrapper = {
		'cross':  document.getElementById('tictactoe-score-cross')  || null,
		'circle': document.getElementById('tictactoe-score-circle') || null
	};
	
	this.score = { 'cross': 0, 'circle': 0 };
	
  this.currentPlayer = Math.round(Math.random()) ? this.CROSS : this.CIRCLE;
	
	if (!this.againstHuman) {
		this.computerColor = Math.round(Math.random()) ? this.CROSS : this.CIRCLE;
	}
	
  this.getSquares();
	
	this.reset();
}

/**
 * Reset the game.
 */
TicTacToe.prototype.reset = function() {
	this.round = 0;
	this.squareMap = {};
	
	var oldClass, regExp = new RegExp('(?:^|\\s)(tictactoe-' + this.CROSS + '|tictactoe-' + this.CIRCLE + ')(?:$|\\s)');
	
	for (var i = 0; i < 9; ++i) {
		oldClass = this.squares[i].getAttribute('class');
		
		this.squares[i].setAttribute('class', oldClass.replace(regExp, ''));
	}
	
	if (!this.againstHuman && this.currentPlayer == this.computerColor) {
    this.play();
  }
}

/**
 * Get all squares and attach event listeners.
 */
TicTacToe.prototype.getSquares = function() {
  var squares;
  
  if (document.getElementsByClassName) {
    squares = document.getElementsByClassName('tictactoe-square');
  }
  else {
    var hasClassName = new RegExp('(?:^|\\s)tictactoe-square(?:$|\\s)'),
        allElements  = document.getElementsByTagName('*')
        element = null,
        elementClass = '';
    
    squares = new Array();
		
    for (var i = 0; (element = allElements[i]) != null; i++) {
			elementClass = element.className;
      
			if (elementClass && elementClass.indexOf('tictactoe-square') != -1 && hasClassName.test(elementClass)) {
				squares.push(element);
			}
		}
  }
  
  this.squares = squares;
  
  this.addEventListeners();
	
	return this.squares;
}

/**
 * Add event listeners to all squares.
 */
TicTacToe.prototype.addEventListeners = function() {
  for (var i = 0, len = this.squares.length; i < len; ++i) {
		// We need a reference to this. Pass it as game.
    (function(game, square) {
			var callback = function() {
        game.click(this);
      };
			
			if (square.addEventListener) {
				square.addEventListener('click', callback, false);
			}
			else if (square.attachEvent) {
				square.attachEvent('onclick', callback, false);
			}
			else {
				throw new Error('Could not attach event listeners');
			}
			
    })(this, this.squares[i])
  }
}

/**
 * Square click handler.
 * Stores the clicked square and switches the player.
 *
 * @see TicTacToe.store()
 *
 * @param {HTMLElement} element
 * 				The clicked square
 */
TicTacToe.prototype.click = function(element) {
  if (!this.squareMap[element.id]) {    
    if (this.store(element.id, this.currentPlayer)) {
			this.changePlayer();
			
			return true;
		}
  }
  else {
    // Already played
		return false;
  }
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
	// If this square was already played, abort
	if (!!this.squareMap[id]) {
		return false;
	}
	
  this.squareMap[id] = color;
  
  var element = document.getElementById(id),
			linesToCheck = [];

	element.setAttribute('class' , element.getAttribute('class') + ' tictactoe-' + color);
	
  switch(id) {
    case 'TL':			
			linesToCheck = [['TL', 'TM', 'TR'], ['TL', 'CL', 'BL'], ['TL', 'CM', 'BR']];
      break;
    
    case 'TM':
      linesToCheck = [['TL', 'TM', 'TR'], ['TM', 'CM', 'BM']];
      break;
    
    case 'TR':
      linesToCheck = [['TL', 'TM', 'TR'], ['TR', 'CR', 'BR'], ['TR', 'CM', 'BL']];
      break;
    
    case 'CL':
      linesToCheck = [['TL', 'CL', 'BL'], ['CL', 'CM', 'CR']];
      break;
    
    case 'CM':
      linesToCheck = [['CL', 'CM', 'CR'], ['TM', 'CM', 'BM'], ['TL', 'CM', 'BR'], ['TR', 'CM', 'BL']];
      break;
    
    case 'CR':
      linesToCheck = [['TR', 'CR', 'BR'], ['CL', 'CM', 'CR']];
      break;
    
    case 'BL':
      linesToCheck = [['BL', 'BM', 'BR'], ['TL', 'CL', 'BL'], ['TR', 'CM', 'BL']];
      break;
    
    case 'BM':
      linesToCheck = [['BL', 'BM', 'BR'], ['TM', 'CM', 'BM']];
      break;
    
    case 'BR':
      linesToCheck = [['BL', 'BM', 'BR'], ['TR', 'CR', 'BR'], ['TL', 'CM', 'BR']];
      break;
		
		default:
			throw new Error("No valid id received !\nId: " + id);
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
	var chosen = null,
			pos = this.defensivePlacement(),
			placeOffensively = false;
			
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
		chosen = this.offensivePlacement(pos.possible);
	}
	else {
		// Passive placement. Go to a random free square
		chosen = pos.possible[Math.round(Math.random() * pos.possible.length - 1)];
	}
	
  console.log(pos);
	console.log(chosen);
	if (!chosen) {
		throw new Error("Error determining where to play !");
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
  var pos = {
		must: null,
		win: null,
		possible: []
	};
	
	var linesToCheck = [
		['TL', 'TM', 'TR'],
		['TL', 'CL', 'BL'],
		['TL', 'CM', 'BR'],
		['TM', 'CM', 'BM'],
		['TR', 'CR', 'BR'],
		['TR', 'CM', 'BL'],
		['CL', 'CM', 'CR'],
		['BL', 'BM', 'BR']
	];
	
	var square1, square2, square3;
	
	for (var i = 0, len = linesToCheck.length; i < len; ++i) {
		// If there are exactly 2 elements in this line and both have the same color,
		// this is a win|must position
		
		// Store squares for code readability
		square1 = this.squareMap[linesToCheck[i][0]] || null;
		square2 = this.squareMap[linesToCheck[i][1]] || null;
		square3 = this.squareMap[linesToCheck[i][2]] || null;
		
		// If there are at least 2 squares in this line, check further
		if ((square1 && square2) || (square1 && square3) || (square2 && square3)) {
			if (square1) {
				if (square1 === square2 && !square3) {
					// Add square 3
					if (square1 === this.computerColor) {
						pos.win = linesToCheck[i][2];
						
						// Must place here anyway. Abort and return
						return pos;
					}
					else {
						pos.must = linesToCheck[i][2];
					}
				}
				else if (square1 === square3 && !square2) {
					// Add square 2
					if (square1 === this.computerColor) {
						pos.win = linesToCheck[i][1];
						
						// Must place here anyway. Abort and return
						return pos;
					}
					else {
						pos.must = linesToCheck[i][1];
					}
				}
				else if ((square1 !== square2 && square2 && !square3) || (square1 !== square3 && square3 && !square2)) {
					// These are possible positions
					if (!square2) {
						pos.possible.push(linesToCheck[i][1]);
					}
					
					if (!square3) {
						pos.possible.push(linesToCheck[i][2]);
					}
				}
			}
			else if (square2) {
				if (square2 === square3 && !square1) {
					// Add square 1
					if (square2 === this.computerColor) {
						pos.win = linesToCheck[i][0];
						
						// Must place here anyway. Abort and return
						return pos;
					}
					else {
						pos.must = linesToCheck[i][0];
					}
				}
				else if (square2 !== square3 && square3 && !square1) {
					// These are possible positions
					pos.possible.push(linesToCheck[i][0]);
				}
			}
			else {
				// These are possible positions
				if (!square1) {
					pos.possible.push(linesToCheck[i][0]);
				}
				
				if (!square2) {
					pos.possible.push(linesToCheck[i][1]);
				}
				
				if (!square3) {
					pos.possible.push(linesToCheck[i][2]);
				}
			}
		}
		else {
			// These are possible positions
			if (!square1) {
				pos.possible.push(linesToCheck[i][0]);
			}
			
			if (!square2) {
				pos.possible.push(linesToCheck[i][1]);
			}
			
			if (!square3) {
				pos.possible.push(linesToCheck[i][2]);
			}
		}
	}
	
	return pos;
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
	var position = possible[0];
	
	return position;
}

/**
 * Check all lines for a win.
 * Checks all lines that contain the last selected square. If
 * the line contains 3 squares and all have the same color, we have a winner.
 *
 * @param {Array} linesToCheck
 * 				The lines that contain the last checked square
 *
 * @returns {Boolean}
 * 				True in case of a win, false if not
 */
TicTacToe.prototype.win = function(linesToCheck) {
	var color;
	
	for (var i = 0, len = linesToCheck.length; i < len; ++i) {
		color = this.squareMap[linesToCheck[i][0]];
		
		// If all three squares are the same, and color is defined we have a winner
		if (color && this.squareMap[linesToCheck[i][1]] === color && this.squareMap[linesToCheck[i][2]] === color) {
			alert(color + ' wins !!');
			
			this.score[color]++;
			
			if (this.scoreWrapper[color]) {
				this.scoreWrapper[color].innerHTML = this.score[color];
			}
			
			this.reset();
			
			return true;
		}
	}
	
	// Is this a tie ?
	if (this.round === 9) {
		alert("Draw");
		
		this.reset();
		
		return true;
	}
	
	return false;
}