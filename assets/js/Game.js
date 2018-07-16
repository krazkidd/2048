Game = function (boardSize, numRandos) {
  // private ///////////////////////////////

  // keep track of game over state so we don't have to search the grid
  // once we've reached the end game
  var isGameOver = false;

  // public ////////////////////////////////

  // the internal game board/grid
  this.board = null;
  this.boardSize = boardSize;

  this.turnCount = 0;

  // number of free spaces
  this.numFree = boardSize * boardSize;
  // highest number on the board
  this.maxCell = 0;

  // privileged ////////////////////////////

  this.IsGameOver = function () {
    // short circuit
    if (isGameOver) {
      return true;
    }

    // see if we can move
    if (this.numFree > 0) {
      return false;
    }

    // see if we can merge
    for (var x = 0; x < this.boardSize; x++) {
      for (var y = 0; y < this.boardSize; y++) {
        if (this._IsValidCell(x, y - 1) && this.board[x][y] == this.board[x][y - 1]) {
          return false;
        } else if (this._IsValidCell(x, y + 1) && this.board[x][y] == this.board[x][y + 1]) {
          return false;
        } else if (this._IsValidCell(x - 1, y) && this.board[x][y] == this.board[x - 1][y]) {
          return false;
        } else if (this._IsValidCell(x + 1, y) && this.board[x][y] == this.board[x + 1][y]) {
          return false;
        }
      }
    }

    isGameOver = true;

    return true;
  }

  // init //////////////////////////////////

  this.board = new Array(this.boardSize);
  for (var x = 0; x < this.boardSize; x++) {
    this.board[x] = new Array(this.boardSize);

    for (var y = 0; y < this.boardSize; y++) {
      this.board[x][y] = 0;
    }
  }

  this.AddRandos(numRandos);
};

// Game.prototype.DIRECTION = {
//   Up: 0,
//   Down: 1,
//   Left: 2,
//   Right: 3
// };

Game.prototype._IsValidCell = function (x, y) {
  return x >= 0 && y >= 0 && x < this.boardSize && y < this.boardSize;
};

Game.prototype.SetCellVal = function (x, y, val) {
  if (!this._IsValidCell(x, y)) {
    return false;
  }

  this.board[x][y] = val;

  // track highest number
  this.maxCell = Math.max(this.maxCell, val);

  return true;
};

Game.prototype.GetCellVal = function (x, y) {
  if (this._IsValidCell(x, y)) {
    return this.board[x][y];
  }

  return -1;
};

Game.prototype.AddRandos = function (count) {
  if (this.IsGameOver() || count > this.numFree) {
    return false;
  }

  for (var i = 0; i < count; i++) {
    // pick a 2 or a 4, but pick 2 more often than 4
    var newCellVal = Math.pow(2, Math.round(Math.random() * 0.65 + 1));

    var x, y;

    do {
      x = Math.floor(Math.random() * this.boardSize);
      y = Math.floor(Math.random() * this.boardSize);
    } while (this.GetCellVal(x, y) > 0)

    this.SetCellVal(x, y, newCellVal);

    this.maxCell = Math.max(this.maxCell, newCellVal);
    this.numFree--;
  }

  return true;
};

Game.prototype.MoveUp = function () {
  if (this.IsGameOver()) {
    return false;
  }

  // for each column, look down and merge up

  var didBoardChange = false;

  for (var x = 0; x < this.boardSize; x++) {
    for (var y1 = 0; y1 < this.boardSize - 1; y1++) {
      var y1Val = this.board[x][y1];

      for (var y2 = y1 + 1; y2 < this.boardSize; y2++) {
        var y2Val = this.board[x][y2];

        if (y2Val == 0) {
          // keep searching

          continue;
        } else if (y1Val == 0 && y2Val != 0) {
          // slide and keep searching

          this.SetCellVal(x, y1, y2Val);
          this.SetCellVal(x, y2, 0);

          y1Val = y2Val;

          didBoardChange = true;

          continue;
        } else if (y1Val != 0 && y1Val == y2Val) {
          // merge and move on

          this.SetCellVal(x, y1, y1Val + y2Val);
          this.SetCellVal(x, y2, 0);

          this.numFree++;

          didBoardChange = true;

          break;
        } else if (y1Val != 0 && y1Val != y2Val && Math.abs(y2 - y1) > 1) {
          // slide and move on

          this.SetCellVal(x, y1 + 1, y2Val);
          this.SetCellVal(x, y2, 0);

          didBoardChange = true;

          break;
        } else if (y1Val != 0 && y1Val != y2Val && Math.abs(y2 - y1) == 1) {
          // move on

          break;
        }
      }
    }
  }

  if (didBoardChange) {
    this.turnCount++;
  }

  return didBoardChange;
};

Game.prototype.MoveDown = function () {
  if (this.IsGameOver()) {
    return false;
  }

  // for each column, look down and merge up

  var didBoardChange = false;

  for (var x = 0; x < this.boardSize; x++) {
    for (var y1 = this.boardSize - 1; y1 > 0; y1--) {
      var y1Val = this.board[x][y1];

      for (var y2 = y1 - 1; y2 >= 0; y2--) {
        var y2Val = this.board[x][y2];

        if (y2Val == 0) {
          // keep searching

          continue;
        } else if (y1Val == 0 && y2Val != 0) {
          // slide and keep searching

          this.SetCellVal(x, y1, y2Val);
          this.SetCellVal(x, y2, 0);

          y1Val = y2Val;

          didBoardChange = true;

          continue;
        } else if (y1Val != 0 && y1Val == y2Val) {
          // merge and move on

          this.SetCellVal(x, y1, y1Val + y2Val);
          this.SetCellVal(x, y2, 0);

          this.numFree++;

          didBoardChange = true;

          break;
        } else if (y1Val != 0 && y1Val != y2Val && Math.abs(y2 - y1) > 1) {
          // slide and move on

          this.SetCellVal(x, y1 - 1, y2Val);
          this.SetCellVal(x, y2, 0);

          didBoardChange = true;

          break;
        } else if (y1Val != 0 && y1Val != y2Val && Math.abs(y2 - y1) == 1) {
          // move on

          break;
        }
      }
    }
  }

  if (didBoardChange) {
    this.turnCount++;
  }

  return didBoardChange;
};

Game.prototype.MoveLeft = function () {
  if (this.IsGameOver()) {
    return false;
  }

  // for each column, look down and merge up

  var didBoardChange = false;

  for (var y = 0; y < this.boardSize; y++) {
    for (var x1 = 0; x1 < this.boardSize - 1; x1++) {
      var x1Val = this.board[x1][y];

      for (var x2 = x1 + 1; x2 < this.boardSize; x2++) {
        var x2Val = this.board[x2][y];

        if (x2Val == 0) {
          // keep searching

          continue;
        } else if (x1Val == 0 && x2Val != 0) {
          // slide and keep searching

          this.SetCellVal(x1, y, x2Val);
          this.SetCellVal(x2, y, 0);

          x1Val = x2Val;

          didBoardChange = true;

          continue;
        } else if (x1Val != 0 && x1Val == x2Val) {
          // merge and move on

          this.SetCellVal(x1, y, x1Val + x2Val);
          this.SetCellVal(x2, y, 0);

          this.numFree++;

          didBoardChange = true;

          break;
        } else if (x1Val != 0 && x1Val != x2Val && Math.abs(x2 - x1) > 1) {
          // slide and move on

          this.SetCellVal(x1 + 1, y, x2Val);
          this.SetCellVal(x2, y, 0);

          didBoardChange = true;

          break;
        } else if (x1Val != 0 && x1Val != x2Val && Math.abs(x2 - x1) == 1) {
          // move on

          break;
        }
      }
    }
  }

  if (didBoardChange) {
    this.turnCount++;
  }

  return didBoardChange;
};

Game.prototype.MoveRight = function () {
  if (this.IsGameOver()) {
    return false;
  }

  // for each column, look down and merge up

  var didBoardChange = false;

  for (var y = 0; y < this.boardSize; y++) {
    for (var x1 = this.boardSize - 1; x1 > 0; x1--) {
      var x1Val = this.board[x1][y];

      for (var x2 = x1 - 1; x2 >= 0; x2--) {
        var x2Val = this.board[x2][y];

        if (x2Val == 0) {
          // keep searching

          continue;
        } else if (x1Val == 0 && x2Val != 0) {
          // slide and keep searching

          this.SetCellVal(x1, y, x2Val);
          this.SetCellVal(x2, y, 0);

          x1Val = x2Val;

          didBoardChange = true;

          continue;
        } else if (x1Val != 0 && x1Val == x2Val) {
          // merge and move on

          this.SetCellVal(x1, y, x1Val + x2Val);
          this.SetCellVal(x2, y, 0);

          this.numFree++;

          didBoardChange = true;

          break;
        } else if (x1Val != 0 && x1Val != x2Val && Math.abs(x2 - x1) > 1) {
          // slide and move on

          this.SetCellVal(x1 - 1, y, x2Val);
          this.SetCellVal(x2, y, 0);

          didBoardChange = true;

          break;
        } else if (x1Val != 0 && x1Val != x2Val && Math.abs(x2 - x1) == 1) {
          // move on

          break;
        }
      }
    }
  }

  if (didBoardChange) {
    this.turnCount++;
  }

  return didBoardChange;
};
