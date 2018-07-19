// This file is part of 204∞.
//
// Copyright © 2018 Mark Ross <krazkidd@gmail.com>
//
// 204∞ is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// 204∞ is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with 204∞.  If not, see <http://www.gnu.org/licenses/>.


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

  this._AddRandos(numRandos);
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

Game.prototype._SetCellVal = function (x, y, val) {
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

Game.prototype._AddRandos = function (count) {
  if (this.IsGameOver()) {
    return false;
  }

  for (var i = 0; i < Math.min(count, this.numFree); i++) {
    // pick a 2 or a 4, but pick 2 more often than 4
    var newCellVal = Math.pow(2, Math.round(Math.random() * 0.65 + 1));

    var x, y;

    do {
      x = Math.floor(Math.random() * this.boardSize);
      y = Math.floor(Math.random() * this.boardSize);
    } while (this.GetCellVal(x, y) > 0)

    this._SetCellVal(x, y, newCellVal);

    this.numFree--;
  }

  return true;
};

Game.prototype.MoveUp = function (numRandos) {
  if (this.IsGameOver()) {
    return false;
  }

  var didBoardChange = false;

  // for each column, look down and merge up
  for (var x = 0; x < this.boardSize; x++) {
    // target index to slide to
    var t = 0;

    for (var y = t + 1; y < this.boardSize; y++) {
      var tVal = this.board[x][t];
      var yVal = this.board[x][y];

      if (yVal > 0) {
        if (tVal == 0) {
          this._SetCellVal(x, t, yVal);
          this._SetCellVal(x, y, 0);

          didBoardChange = true;
        } else if (tVal == yVal) {
          this._SetCellVal(x, t, tVal + yVal);
          this._SetCellVal(x, y, 0);

          t++;

          this.numFree++;
          didBoardChange = true;
        } else { // tVal != yVal
          t++;

          if (y > t) {
            this._SetCellVal(x, t, yVal);
            this._SetCellVal(x, y, 0);

            didBoardChange = true;
          }
        }
      }
    }
  }

  if (didBoardChange) {
    game._AddRandos(numRandos);

    this.turnCount++;

    return true;
  }

  return false;
};

Game.prototype.MoveDown = function (numRandos) {
  if (this.IsGameOver()) {
    return false;
  }

  var didBoardChange = false;

  // for each column, look up and merge down
  for (var x = 0; x < this.boardSize; x++) {
    // target index to slide to
    var t = this.boardSize - 1;

    for (var y = t - 1; y >= 0; y--) {
      var tVal = this.board[x][t];
      var yVal = this.board[x][y];

      if (yVal > 0) {
        if (tVal == 0) {
          this._SetCellVal(x, t, yVal);
          this._SetCellVal(x, y, 0);

          didBoardChange = true;
        } else if (tVal == yVal) {
          this._SetCellVal(x, t, tVal + yVal);
          this._SetCellVal(x, y, 0);

          t--;

          this.numFree++;
          didBoardChange = true;
        } else { // tVal != yVal
          t--;

          if (y < t) {
            this._SetCellVal(x, t, yVal);
            this._SetCellVal(x, y, 0);

            didBoardChange = true;
          }
        }
      }
    }
  }

  if (didBoardChange) {
    game._AddRandos(numRandos);

    this.turnCount++;

    return true;
  }

  return false;
};

Game.prototype.MoveLeft = function (numRandos) {
  if (this.IsGameOver()) {
    return false;
  }

  var didBoardChange = false;

  // for each column, look right and merge left
  for (var y = 0; y < this.boardSize; y++) {
    // target index to slide to
    var t = 0;

    for (var x = t + 1; x < this.boardSize; x++) {
      var tVal = this.board[t][y];
      var xVal = this.board[x][y];

      if (xVal > 0) {
        if (tVal == 0) {
          this._SetCellVal(t, y, xVal);
          this._SetCellVal(x, y, 0);

          didBoardChange = true;
        } else if (tVal == xVal) {
          this._SetCellVal(t, y, tVal + xVal);
          this._SetCellVal(x, y, 0);

          t++;

          this.numFree++;
          didBoardChange = true;
        } else { // tVal != xVal
          t++;

          if (x > t) {
            this._SetCellVal(t, y, xVal);
            this._SetCellVal(x, y, 0);

            didBoardChange = true;
          }
        }
      }
    }
  }

  if (didBoardChange) {
    game._AddRandos(numRandos);

    this.turnCount++;

    return true;
  }

  return false;
};

Game.prototype.MoveRight = function (numRandos) {
  if (this.IsGameOver()) {
    return false;
  }

  var didBoardChange = false;

  // for each column, look left and merge right
  for (var y = 0; y < this.boardSize; y++) {
    // target index to slide to
    var t = this.boardSize - 1;

    for (var x = t - 1; x >= 0; x--) {
      var tVal = this.board[t][y];
      var xVal = this.board[x][y];

      if (xVal > 0) {
        if (tVal == 0) {
          this._SetCellVal(t, y, xVal);
          this._SetCellVal(x, y, 0);

          didBoardChange = true;
        } else if (tVal == xVal) {
          this._SetCellVal(t, y, tVal + xVal);
          this._SetCellVal(x, y, 0);

          t--;

          this.numFree++;
          didBoardChange = true;
        } else { // tVal != xVal
          t--;

          if (x < t) {
            this._SetCellVal(t, y, xVal);
            this._SetCellVal(x, y, 0);

            didBoardChange = true;
          }
        }
      }
    }
  }

  if (didBoardChange) {
    game._AddRandos(numRandos);

    this.turnCount++;

    return true;
  }

  return false;
};

// Game.prototype._RecordMoveChange(arr, oldX, oldY, newX, newY) {
//   arr.push({
//     oldX,
//     oldY,
//     newX,
//     newY
//   });
// }
