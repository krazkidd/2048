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


// NOTE: Sorry, no namespace.

// the internal game board/grid
var board;

var turnCount;

var DIRECTION = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3
};

// $(document).ready()...
$(function () {
  init();
});

// initialize the page
function init() {
  resetGame();

  // reset button handler
  $("button[name='reset']").on("click", function() {
    resetGame();

    $(this).blur();
  });

  // game board handler
   document.addEventListener('keyup', keyboardHandler);
}

function resetGame() {
  board = null;
  turnCount = 0;

  initGrid(4);

  initGame(4);

  updateGameStatus();
}

// build the grid
function initGrid(gridSize) {
  $("#game").empty();

  $("<div/>")
    .attr("id", "grid")
    .appendTo("#game");

  for (var y = 0; y < gridSize; y++) {
    // create row
    var row = $("<div/>")
      .attr("class", "row")
      .height(Math.floor($("#grid").height() / gridSize))
      .appendTo("#grid");

    for (var x = 0; x < gridSize; x++) {
      // create cell
      var cellSize = Math.floor(Number(row.width()) / gridSize);

      var cell = $("<div/>")
        .attr("id", "cell" + "-" + x + "-" + y)
        .attr("class", "cell")
        .outerWidth(cellSize - 10)
        .outerHeight(cellSize - 10)
        .appendTo(row);
    }
  }
}

function initGame(gridSize) {
  board = new Array(gridSize);

  for (var x = 0; x < gridSize; x++) {
    board[x] = new Array(gridSize);

    for (var y = 0; y < gridSize; y++) {
      board[x][y] = 0;
    }
  }

  addRandos(2);
}

function addRandos(count) {
  //TODO this should be optimized; keep track of free spaces instead
  //     of counting each time
  var numFreeSpaces = 0;

  for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[x].length; y++) {
      if (board[x][y] == 0) {
        numFreeSpaces++;
      }

      if (numFreeSpaces == count) {
        break;
      }
    }

    if (numFreeSpaces == count) {
      break;
    }
  }

  if (numFreeSpaces != count) {
    return false;
  }

  for (var i = 0; i < count; i++) {
    var x, y;

    do {
      x = Math.floor(Math.random() * board.length);
      y = Math.floor(Math.random() * board[i].length);
    } while (board[x][y] > 0)

    // pick a 2 or a 4, but pick 2 more often than 4
    board[x][y] = Math.pow(2, Math.round(Math.random() * 0.65 + 1));
  }

  return true;
}

// implements the game logic
function keyboardHandler(event) {
  var didBoardChange = false;

  switch (event.code) {
    case "ArrowUp":
      didBoardChange = moveBoardUp();

      break;
    case "ArrowDown":
      didBoardChange = moveBoardDown();

      break;
    case "ArrowLeft":
      didBoardChange = moveBoardLeft();

      break;
    case "ArrowRight":
      didBoardChange = moveBoardRight();

      break;
  }

  if (didBoardChange && addRandos(1)) {
    turnCount++;
  } else {
    //TODO game over
  }

  updateGameStatus();
}

function moveBoardUp() {
  // for each column, look down and merge up

  var didBoardChange = false;

  for (var x = 0; x < board.length; x++) {
    for (var y1 = 0; y1 < board[x].length - 1; y1++) {
      var y1Val = board[x][y1];

      for (var y2 = y1 + 1; y2 < board[x].length; y2++) {
        var y2Val = board[x][y2];

        if (y2Val == 0) {
          // keep searching

          continue;
        } else if (y1Val == 0 && y2Val != 0) {
          // slide up and keep searching

          board[x][y1] = y2Val;
          board[x][y2] = 0;

          y1Val = y2Val;

          didBoardChange = true;

          continue;
        } else if (y1Val != 0 && y1Val == y2Val) {
          // merge and move on

          board[x][y1] += y2Val;
          board[x][y2] = 0;

          didBoardChange = true;

          break;
        } else if (y1Val != 0 && y1Val != y2Val && Math.abs(y2 - y1) > 1) {
          // slide up and move on

          board[x][y1 + 1] = y2Val;
          board[x][y2] = 0;

          didBoardChange = true;

          break;
        } else if (y1Val != 0 && y1Val != y2Val && Math.abs(y2 - y1) == 1) {
          // move on

          break;
        }
      }
    }
  }

  return didBoardChange;
}

function moveBoardDown() {
  // for each column, look down and merge up

  var didBoardChange = false;

  for (var x = 0; x < board.length; x++) {
    for (var y1 = board[x].length - 1; y1 > 0; y1--) {
      var y1Val = board[x][y1];

      for (var y2 = y1 - 1; y2 >= 0; y2--) {
        var y2Val = board[x][y2];

        if (y2Val == 0) {
          // keep searching

          continue;
        } else if (y1Val == 0 && y2Val != 0) {
          // slide down and keep searching

          board[x][y1] = y2Val;
          board[x][y2] = 0;

          y1Val = y2Val;

          didBoardChange = true;

          continue;
        } else if (y1Val != 0 && y1Val == y2Val) {
          // merge and move on

          board[x][y1] += y2Val;
          board[x][y2] = 0;

          didBoardChange = true;

          break;
        } else if (y1Val != 0 && y1Val != y2Val && Math.abs(y2 - y1) > 1) {
          // slide down and move on

          board[x][y1 - 1] = y2Val;
          board[x][y2] = 0;

          didBoardChange = true;

          break;
        } else if (y1Val != 0 && y1Val != y2Val && Math.abs(y2 - y1) == 1) {
          // move on

          break;
        }
      }
    }
  }

  return didBoardChange;
}

function moveBoardLeft() {
  // for each column, look down and merge up

  var didBoardChange = false;

  for (var y = 0; y < board[0].length; y++) {
    for (var x1 = 0; x1 < board.length - 1; x1++) {
      var x1Val = board[x1][y];

      for (var x2 = x1 + 1; x2 < board.length; x2++) {
        var x2Val = board[x2][y];

        if (x2Val == 0) {
          // keep searching

          continue;
        } else if (x1Val == 0 && x2Val != 0) {
          // slide up and keep searching

          board[x1][y] = x2Val;
          board[x2][y] = 0;

          x1Val = x2Val;

          didBoardChange = true;

          continue;
        } else if (x1Val != 0 && x1Val == x2Val) {
          // merge and move on

          board[x1][y] += x2Val;
          board[x2][y] = 0;

          didBoardChange = true;

          break;
        } else if (x1Val != 0 && x1Val != x2Val && Math.abs(x2 - x1) > 1) {
          // slide up and move on

          board[x1 + 1][y] = x2Val;
          board[x2][y] = 0;

          didBoardChange = true;

          break;
        } else if (x1Val != 0 && x1Val != x2Val && Math.abs(x2 - x1) == 1) {
          // move on

          break;
        }
      }
    }
  }

  return didBoardChange;
}

function moveBoardRight() {
  // for each column, look down and merge up

  var didBoardChange = false;

  for (var y = 0; y < board[board.length - 1].length; y++) {
    for (var x1 = board.length - 1; x1 > 0; x1--) {
      var x1Val = board[x1][y];

      for (var x2 = x1 - 1; x2 >= 0; x2--) {
        var x2Val = board[x2][y];

        if (x2Val == 0) {
          // keep searching

          continue;
        } else if (x1Val == 0 && x2Val != 0) {
          // slide down and keep searching

          board[x1][y] = x2Val;
          board[x2][y] = 0;

          x1Val = x2Val;

          didBoardChange = true;

          continue;
        } else if (x1Val != 0 && x1Val == x2Val) {
          // merge and move on

          board[x1][y] += x2Val;
          board[x2][y] = 0;

          didBoardChange = true;

          break;
        } else if (x1Val != 0 && x1Val != x2Val && Math.abs(x2 - x1) > 1) {
          // slide down and move on

          board[x1 - 1][y] = x2Val;
          board[x2][y] = 0;

          didBoardChange = true;

          break;
        } else if (x1Val != 0 && x1Val != x2Val && Math.abs(x2 - x1) == 1) {
          // move on

          break;
        }
      }
    }
  }

  return didBoardChange;
}

function updateGameStatus() {
  $("#turncount").text("Turns: " + turnCount);

  updateGrid();
}


function updateGrid() {
  for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[x].length; y++) {
      if (board[x][y] > 0) {
        $("#cell" + "-" + x + "-" + y).text(board[x][y]);
      } else {
        $("#cell" + "-" + x + "-" + y).html("&nbsp;");
      }
    }
  }
}
