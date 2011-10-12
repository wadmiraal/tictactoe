
function TicTacToe(cssClass, againstHuman) {
  this.cssClass = cssClass;
  this.againstHuman = againstHuman ? true : false;
  this.WHITE = 'white';
  this.BLACK = 'black';
  this.currentPlayer = Math.round(Math.random()) ? this.WHITE : this.BLACK;
  this.computerColor = Math.round(Math.random()) ? this.WHITE : this.BLACK;
	this.lines = {
      top: ['TL', 'TM', 'TR'],
      center: ['CL', 'CM', 'CR'],
      bottom: ['BL', 'BM', 'BR'],
      left: ['TL', 'CL', 'BL'],
      middle: ['TM', 'CM', 'BM'],
      right: ['TR', 'CR', 'BR'],
      diagonal1: ['TL', 'CM', 'BR'],
      diagonal2: ['TR', 'CM', 'BL']
	};
  
  this.getSquares();
  
  this.addEventListeners();
  
  this.reset();
  
  if (this.currentPlayer == this.computerColor) {
    this.play();
  }
}

TicTacToe.prototype.reset = function() {
  this.topRow = [];
  this.centerRow = [];
  this.bottomRow = [];
  this.leftCol = [];
  this.middleCol = [];
  this.rightCol = [];
  this.diagonal1 = [];
  this.diagonal2 = [];
  this.squareMap = {};
}

TicTacToe.prototype.getSquares = function() {
  var squares;
  
  if (document.getElementsByClassName) {
    squares = document.getElementsByClassName(this.cssClass);
  }
  else {
    var hasClassName = new RegExp("(?:^|\\s)" + this.cssClass.replace('-', '\-') + "(?:$|\\s)"),
        allElements  = document.getElementsByTagName("*")
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
}

TicTacToe.prototype.addEventListeners = function() {
  for (var i = 0, len = this.squares.length; i < len; ++i) {
    (function(ticTacToe, square) {
      square.addEventListener('click', function() {
        ticTacToe.click(this);
      }, false);
    })(this, this.squares[i])
  }
}

TicTacToe.prototype.click = function(element) {
  if (!this.squareMap[element.id]) {    
    this.store(element.id, this.currentPlayer);
    
    this.changePlayer();
  }
  else {
    alert('already played');
  }
  
  return false;
}

TicTacToe.prototype.store = function(id, color) {
  this.squareMap[id] = color;
  
  var element = document.getElementById(id);
  element.setAttribute('class' , element.getAttribute('class') + ' ' + color);
  
  switch(id) {
    case 'TL':
      this.topRow.push(id);
      this.leftCol.push(id);
      this.diagonal1.push(id);
      break;
    
    case 'TM':
      this.topRow.push(id);
      this.middleCol.push(id);
      break;
    
    case 'TR':
      this.topRow.push(id);
      this.rightCol.push(id);
      this.diagonal2.push(id);
      break;
    
    case 'CL':
      this.centerRow.push(id);
      this.leftCol.push(id);
      break;
    
    case 'CM':
      this.centerRow.push(id);
      this.middleCol.push(id);
      this.diagonal1.push(id);
      this.diagonal2.push(id);
      break;
    
    case 'CR':
      this.centerRow.push(id);
      this.rightCol.push(id);
      break;
    
    case 'BL':
      this.bottomRow.push(id);
      this.leftCol.push(id);
      this.diagonal2.push(id);
      break;
    
    case 'BM':
      this.bottomRow.push(id);
      this.middleCol.push(id);
      break;
    
    case 'BR':
      this.bottomRow.push(id);
      this.rightCol.push(id);
      this.diagonal1.push(id);
      break;    
  }
	
	this.win();
}

TicTacToe.prototype.changePlayer = function() {
  this.currentPlayer = this.currentPlayer == this.WHITE ? this.BLACK : this.WHITE;
  
  if (!this.againstHuman && this.currentPlayer == this.computerColor) {
    this.play();
  }
}

TicTacToe.prototype.play = function() {
  var freePositions;
      
  // Defensive first
  freePositions = this.defensivePlacement();
  
  if (freePositions.must) {
    this.store(freePositions.must, this.currentPlayer);
    
    this.changePlayer();
    
    return;
  }
  
  // Offensive placement
  
  
  // Passive placement. Go to a random free square
  this.store(freePositions.possible[Math.round(Math.random() * freePositions.possible.length)], this.currentPlayer);
  
  this.changePlayer();  
}

TicTacToe.prototype.defensivePlacement = function() {
  var pos = { 'must': null, 'possible': [] };
  
  // Top
  if (this.topRow.length == 2 && this.squareMap[this.topRow[0]] == this.squareMap[this.topRow[1]]) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.top[i]]) {
        pos.must = this.lines.top[i];
        
        return pos;
      }
    }
  }
  else if (this.topRow.length <= 2) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.top[i]]) {
        pos.possible.push(this.lines.top[i]);
      }
    }
  }
  
  // Center
  if (this.centerRow.length == 2 && this.squareMap[this.centerRow[0]] == this.squareMap[this.centerRow[1]]) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.center[i]]) {
        pos.must = this.lines.center[i];
        
        return pos;
      }
    }
  }
  else if (this.centerRow.length <= 2) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.center[i]]) {
        pos.possible.push(this.lines.center[i]);
      }
    }
  }
  
  // Bottom
  if (this.bottomRow.length == 2 && this.squareMap[this.bottomRow[0]] == this.squareMap[this.bottomRow[1]]) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.bottom[i]]) {
        pos.must = this.lines.bottom[i];
        
        return pos;
      }
    }
  }
  else if (this.bottomRow.length <= 2) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.bottom[i]]) {
        pos.possible.push(this.lines.bottom[i]);
      }
    }
  }
  
  // Left
  if (this.leftCol.length == 2 && this.squareMap[this.leftCol[0]] == this.squareMap[this.leftCol[1]]) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.left[i]]) {
        pos.must = this.lines.left[i];
        
        return pos;
      }
    }
  }
  else if (this.leftCol.length <= 2) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.left[i]]) {
        pos.possible.push(this.lines.left[i]);
      }
    }
  }
  
  // Middle
  if (this.middleCol.length == 2 && this.squareMap[this.middleCol[0]] == this.squareMap[this.middleCol[1]]) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.middle[i]]) {
        pos.must = this.lines.middle[i];
        
        return pos;
      }
    }
  }
  else if (this.middleCol.length <= 2) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.middle[i]]) {
        pos.possible.push(this.lines.middle[i]);
      }
    }
  }
  
  // Right
  if (this.rightCol.length == 2 && this.squareMap[this.rightCol[0]] == this.squareMap[this.rightCol[1]]) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.right[i]]) {
        pos.must = this.lines.right[i];
        
        return pos;
      }
    }
  }
  else if (this.rightCol.length <= 2) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.right[i]]) {
        pos.possible.push(this.lines.right[i]);
      }
    }
  }
  
  // Diagonal 1
  if (this.diagonal1.length == 2 && this.squareMap[this.diagonal1[0]] == this.squareMap[this.diagonal1[1]]) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.diagonal1[i]]) {
        pos.must = this.lines.diagonal1[i];
        
        return pos;
      }
    }
  }
  else if (this.diagonal1.length <= 2) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.diagonal1[i]]) {
        pos.possible.push(this.lines.diagonal1[i]);
      }
    }
  }
  
  // Diagonal 2
  if (this.diagonal2.length == 2 && this.squareMap[this.diagonal2[0]] == this.squareMap[this.diagonal2[1]]) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.diagonal2[i]]) {
        pos.must = this.lines.diagonal2[i];
        
        return pos;
      }
    }
  }
  else if (this.diagonal2.length <= 2) {
    for (var i = 0; i < 3; ++i) {
      if (!this.squareMap[this.lines.diagonal2[i]]) {
        pos.possible.push(this.lines.diagonal2[i]);
      }
    }
  }
  
  return pos
}

TicTacToe.prototype.win = function() {
	console.log("WIN");
	// Top
	if (this.topRow.length == 3 && this.squareMap[this.topRow[0]] == this.squareMap[this.topRow[1]] && this.squareMap[this.topRow[0]] == this.squareMap[this.topRow[2]]) {
		alert(this.squareMap[this.topRow[0]] + ' wins !!');
	}
	
	// Center
	if (this.centerRow.length == 3 && this.squareMap[this.centerRow[0]] == this.squareMap[this.centerRow[1]] && this.squareMap[this.centerRow[0]] == this.squareMap[this.centerRow[2]]) {
		alert(this.squareMap[this.centerRow[0]] + ' wins !!');
	}
	
	// Bottom
	if (this.bottomRow.length == 3 && this.squareMap[this.bottomRow[0]] == this.squareMap[this.bottomRow[1]] && this.squareMap[this.bottomRow[0]] == this.squareMap[this.bottomRow[2]]) {
		alert(this.squareMap[this.bottomRow[0]] + ' wins !!');
	}
	
	// Left
	if (this.leftCol.length == 3 && this.squareMap[this.leftCol[0]] == this.squareMap[this.leftCol[1]] && this.squareMap[this.leftCol[0]] == this.squareMap[this.leftCol[2]]) {
		alert(this.squareMap[this.leftCol[0]] + ' wins !!');
	}
	
	// Middle
	if (this.middleCol.length == 3 && this.squareMap[this.middleCol[0]] == this.squareMap[this.middleCol[1]] && this.squareMap[this.middleCol[0]] == this.squareMap[this.middleCol[2]]) {
		alert(this.squareMap[this.middleCol[0]] + ' wins !!');
	}
	
	// Right
	if (this.rightCol.length == 3 && this.squareMap[this.rightCol[0]] == this.squareMap[this.rightCol[1]] && this.squareMap[this.rightCol[0]] == this.squareMap[this.rightCol[2]]) {
		alert(this.squareMap[this.rightCol[0]] + ' wins !!');
	}
	
	// Diagonal1
	if (this.diagonal1.length == 3 && this.squareMap[this.diagonal1[0]] == this.squareMap[this.diagonal1[1]] && this.squareMap[this.diagonal1[0]] == this.squareMap[this.diagonal1[2]]) {
		alert(this.squareMap[this.diagonal1[0]] + ' wins !!');
	}
	
	// Diagonal2
	if (this.diagonal2.length == 3 && this.squareMap[this.diagonal2[0]] == this.squareMap[this.diagonal2[1]] && this.squareMap[this.diagonal2[0]] == this.squareMap[this.diagonal2[2]]) {
		alert(this.squareMap[this.diagonal2[0]] + ' wins !!');
	}
}
