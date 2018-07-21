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

var ANIMATION_DURATION = 80;

var game;

var isFirst2048 = false;

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

  //TODO animate board initialization?
  updateGrid();
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
        .append("<span/>")
        .appendTo(row);
    }
  }
}

// implements the game logic
function keyboardHandler(event) {
  //TODO how much of this should be wrapped in a setTimeout()?
  if (game.IsGameOver()) {
    return;
  }

  var moves = null;

  switch (event.code) {
    case "ArrowUp":
      moves = game.MoveUp(1);

      break;
    case "ArrowDown":
      moves = game.MoveDown(1);

      break;
    case "ArrowLeft":
      moves = game.MoveLeft(1);

      break;
    case "ArrowRight":
      moves = game.MoveRight(1);

      break;
  }

  if (moves && moves.length > 0) {
    animateMoves(moves);

    updateGameStatus();
  }
}

function animateMoves(moves) {
  $all = $("#grid div").children("span");

  // jump animations from previous turn to their end state
  $all.finish();

  // when that is done, hide all the cells that are changing
  $all.promise().done(function () {
    moves.forEach(function (move) {
      // NOTE: We might restart the animation with the same duration, but this
      //       will only affect newly spawned tiles taking over a vacated spot.
      //       If this loop is fast, we'll never notice.

      // i guess stop (and continue) any running animations, too
      $("#cell" + "-" + move.oldX + "-" + move.oldY).children("span").stop().fadeOut(ANIMATION_DURATION);
      $("#cell" + "-" + move.newX + "-" + move.newY).children("span").stop().fadeOut(ANIMATION_DURATION);
    });
  });

  // and when that is done, update the grid and
  // bring it all down to funky town
  $all.promise().done(function () {
    updateGrid();

    $all.fadeIn(ANIMATION_DURATION);
  });
}

function updateGrid() {
  for (var x = 0; x < game.boardSize; x++) {
    for (var y = 0; y < game.boardSize; y++) {
      var $cell = $("#cell" + "-" + x + "-" + y).children("span");

      if (game.GetCellVal(x, y) > 0) {
        $cell.text(game.GetCellVal(x, y));
      } else {
        $cell.html("&nbsp;");
      }
    }
  }
}

function updateGameStatus() {
  $("#score").text("Score: " + game.score);

  if (game.maxCell >= 2048 && !isFirst2048) {
    // show win state

    window.alert("You won!");

    // only show once
    isFirst2048 = true;
  } else if (game.score >= 131070) {
    // show super win state

    window.alert("You won! You, like, really won. Don't come back.");
  } else if (game.IsGameOver() && !isFirst2048) {
    // show lose state

    window.alert("You lost!");
  } else if (game.IsGameOver() && isFirst2048) {
    // show game over state

    window.alert("Game over!");
  }
}
