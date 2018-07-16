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

var game;

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
  game = new Game(4, 2);

  initGrid();

  updateGameStatus();
}

// build the grid
function initGrid() {
  $("#game").empty();

  $("<div/>")
    .attr("id", "grid")
    .appendTo("#game");

  for (var y = 0; y < game.boardSize; y++) {
    // create row
    var row = $("<div/>")
      .attr("class", "row")
      .height(Math.floor($("#grid").height() / game.boardSize))
      .appendTo("#grid");

    for (var x = 0; x < game.boardSize; x++) {
      // create cell
      var cellSize = Math.floor(Number(row.width()) / game.boardSize);

      var cell = $("<div/>")
        .attr("id", "cell" + "-" + x + "-" + y)
        .attr("class", "cell")
        .outerWidth(cellSize - 10)
        .outerHeight(cellSize - 10)
        .appendTo(row);
    }
  }
}

// implements the game logic
function keyboardHandler(event) {
  var didBoardChange = false;

  switch (event.code) {
    case "ArrowUp":
      didBoardChange = game.MoveUp();

      break;
    case "ArrowDown":
      didBoardChange = game.MoveDown();

      break;
    case "ArrowLeft":
      didBoardChange = game.MoveLeft();

      break;
    case "ArrowRight":
      didBoardChange = game.MoveRight();

      break;
  }

  if (didBoardChange && game.AddRandos(1)) {
    updateGameStatus();
  }
}

function updateGameStatus() {
  $("#turncount").text("Turns: " + game.turnCount);

  updateGrid();

  //TODO is game won or over?
}


function updateGrid() {
  for (var x = 0; x < game.boardSize; x++) {
    for (var y = 0; y < game.boardSize; y++) {
      if (game.GetCellVal(x, y) > 0) {
        $("#cell" + "-" + x + "-" + y).text(game.GetCellVal(x, y));
      } else {
        $("#cell" + "-" + x + "-" + y).html("&nbsp;");
      }
    }
  }
}
