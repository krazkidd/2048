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


var ANIMATION_DURATION = 80;

/** @type {Game} */
var game;

/** @type {boolean} */
var isFirst2048 = false;

$(function () {
  $("#reset").on("click", function () {
    resetGame();

    $(this).blur();
  });

  resetGame();

  document.addEventListener("keyup", keyboardHandler);
});

/**
 * TODO
 */
function resetGame() {
  game = new Game(4, 2);

  initGrid();

  //TODO animate board initialization?
  updateGrid();
  updateGameStatus();
}

/**
 * Build the grid.
 */
function initGrid() {
  var $game = $("#game").empty();

  for (var y = 0; y < game.boardSize; y++) {
    var $row = $("<div>")
      .addClass("row")
      .appendTo($game);

    for (var x = 0; x < game.boardSize; x++) {
      var $col = $("<div>")
        .addClass("col")
        .appendTo($row);

      $("<div>")
        .attr("id", "game-cell" + "-" + x + "-" + y)
        .addClass("game-cell")
        .append("<span>")
        .appendTo($col);
    }
  }
}

/**
 * Implements the game logic.
 * @param  {Event} event
 *         TODO
 */
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

/**
 * TODO
 * @param {MoveLogItem[]} moves
 */
function animateMoves(moves) {
  $all = $("#game .game-cell").children("span");

  // jump animations from previous turn to their end state
  $all.finish();

  // when that is done, hide all the cells that are changing
  $all.promise().done(function () {
    moves.forEach(function (move) {
      // NOTE: We might restart the animation with the same duration, but this
      //       will only affect newly spawned tiles taking over a vacated spot.
      //       If this loop is fast, we'll never notice.

      // i guess stop (and continue) any running animations, too
      $("#game-cell" + "-" + move.oldX + "-" + move.oldY)
        .children("span")
        .stop()
        .fadeOut(ANIMATION_DURATION);
      $("#game-cell" + "-" + move.newX + "-" + move.newY)
        .children("span")
        .stop()
        .fadeOut(ANIMATION_DURATION);
    });
  });

  // and when that is done, update the grid and
  // bring it all down to funky town
  $all.promise().done(function () {
    updateGrid();

    $all.fadeIn(ANIMATION_DURATION);
  });
}

/**
 * TODO
 */
function updateGrid() {
  for (var x = 0; x < game.boardSize; x++) {
    for (var y = 0; y < game.boardSize; y++) {
      var $cell = $("#game-cell" + "-" + x + "-" + y).children("span");

      if (game.GetCellVal(x, y) > 0) {
        $cell.text(game.GetCellVal(x, y));
      } else {
        $cell.html("&nbsp;");
      }
    }
  }
}

/**
 * TODO
 */
function updateGameStatus() {
  $("#score").text(game.score);

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
