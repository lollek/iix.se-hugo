/* Created by Olle Kvarnstrom
 * Kamo.png image made by Sofie Aid */

/* Constants: */
var CARD_SIZE = 150;
var CARDS_PER_ROW = 3;
var CANVAS_WIDTH = CARD_SIZE * CARDS_PER_ROW;
var CANVAS_HEIGHT = CARD_SIZE * CARDS_PER_ROW;
var ROTATIONS = 4;
var KAMO_IMAGE;

/* Mutable things: */
var gCanvasContext;
var gDeck;
var gCursorFocus = -1;

/** Card()
 * Cards are the moveable objects in this game
 * @param pos position on the game board (0-8)
 * @param r rotation of card
 * @param id position on the source image (0-8) */
var Card = function(pos, r, id) {
    this.pos = pos;
    this.r = r;
    this.id = id;
};

/** Deck()
 * A deck of 9 cards */
var Deck = function() {
  var ids = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  function randomRotation() { return Math.floor(Math.random() * ROTATIONS); }
  function next(list) { return list.splice(Math.random() * list.length, 1)[0]; }

  this.cards = [
    new Card(0, randomRotation(), next(ids))
   ,new Card(1, randomRotation(), next(ids))
   ,new Card(2, randomRotation(), next(ids))
   ,new Card(3, randomRotation(), next(ids))
   ,new Card(4, randomRotation(), next(ids))
   ,new Card(5, randomRotation(), next(ids))
   ,new Card(6, randomRotation(), next(ids))
   ,new Card(7, randomRotation(), next(ids))
   ,new Card(8, randomRotation(), next(ids))
  ];
};

/** Deck.rotate(cardPos)
 * Rotate card clockwise
 * @param cardPos card in which position to rotate */
Deck.prototype.rotate = function(cardPos) {
  for (var i = 0; i < this.cards.length; ++i)
    if (cardPos == this.cards[i].pos) {
      this.cards[i].r = (this.cards[i].r +ROTATIONS +1) % ROTATIONS;
      this.draw();
      return;
    }
};

/** Deck.swap(cardPos1, cardPos2)
 * Swap the place of card1 with card2 */
Deck.prototype.swap = function(cardPos1, cardPos2) {
  for (var i = 0; i < this.cards.length; ++i)
    if (this.cards[i].pos == cardPos1)
      var card1 = i;
    else if (this.cards[i].pos == cardPos2)
      var card2 = i;

  if (card1 === undefined || card2 === undefined)
    return;

  var tmp = this.cards[card1].pos;
  this.cards[card1].pos = this.cards[card2].pos;
  this.cards[card2].pos = tmp;
  this.draw();
};

/** draw() 
 * Draw all cards to the canvas 
 *
 * Since I have no idea how to rotate an Image object we'll 
 * rotate the canvas 4 times and blit the relevant cards on 
 * the relevant rotation */
Deck.prototype.draw = function() {
  for (var r = 0; r < ROTATIONS; ++r) {
    for (var i = 0; i < this.cards.length; ++i) {
      if (this.cards[i].r != r)
        continue;

      var sourceX = this.cards[i].id % CARDS_PER_ROW;
      var sourceY = Math.floor(this.cards[i].id / CARDS_PER_ROW);
      if (r == 0) {
        var targetX = this.cards[i].pos % CARDS_PER_ROW;
        var targetY = Math.floor(this.cards[i].pos / CARDS_PER_ROW);
      } else if (r == 1) {
        var targetX = Math.floor(this.cards[i].pos / CARDS_PER_ROW);
        var targetY = -((this.cards[i].pos % CARDS_PER_ROW) +1);
      } else if (r == 2) {
        var targetX = -((this.cards[i].pos % CARDS_PER_ROW) +1);
        var targetY = -(Math.floor(this.cards[i].pos / CARDS_PER_ROW) +1);
      } else if (r == 3) {
        var targetX = -(Math.floor(this.cards[i].pos / CARDS_PER_ROW) +1);
        var targetY = this.cards[i].pos % CARDS_PER_ROW;
      }

      gCanvasContext.drawImage(
          KAMO_IMAGE,
          sourceX * CARD_SIZE, sourceY * CARD_SIZE, CARD_SIZE, CARD_SIZE,
          targetX * CARD_SIZE, targetY * CARD_SIZE, CARD_SIZE, CARD_SIZE);
    }
    gCanvasContext.rotate(Math.PI / 2);
  }

  /* Draw a grid:
   * We'll use this as a way of highlighting cards later */
  gCanvasContext.beginPath();
  for (var i = 0; i <= CARDS_PER_ROW; i++) {
    gCanvasContext.moveTo(i * CARD_SIZE, 0);
    gCanvasContext.lineTo(i * CARD_SIZE, CARDS_PER_ROW * CARD_SIZE);
    gCanvasContext.moveTo(0, i * CARD_SIZE);
    gCanvasContext.lineTo(CARDS_PER_ROW * CARD_SIZE, i * CARD_SIZE);
  }
  gCanvasContext.strokeStyle = "grey";
  gCanvasContext.stroke();

};

/** drawOutline() 
 * Draw a nice box around a Card
 * @param cardNumber Card.pos of the card we'll outline
 * @param color color of the border */
function drawOutline (cardNumber, color) {
    var x = (cardNumber % CARDS_PER_ROW) * CARD_SIZE;
    var y = Math.floor(cardNumber / CARDS_PER_ROW) * CARD_SIZE;
    gCanvasContext.strokeStyle = color;
    gCanvasContext.strokeRect(x, y, CARD_SIZE, CARD_SIZE);
}

/** getMousePos(e)
 * Return { x: #, y: # }, being mouse x and y inside the canvas
 * @e event */
function getMousePos(e) {
  var rect = gCanvasContext.canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

/** handleEventClick()
 * Pretty self explanatory, handle mouseclick events
 * @e event */
function handleEventClick(e) {
  var pos = getMousePos(e);
  var newFocus = (Math.floor(pos.x / CARD_SIZE) +
                  Math.floor(pos.y / CARD_SIZE) * CARDS_PER_ROW);

    /* Clicking a Card twice will rotate it clockwise: */
    if (gCursorFocus == newFocus) {
      gDeck.rotate(gCursorFocus);
      gCursorFocus = -1;

    /* If no Card is selected: Select it: */
    } else if (gCursorFocus == -1) {
        drawOutline(newFocus, "black");
        gCursorFocus = newFocus;

    /* If a Card is already selected, swap them: */
    } else {
        gDeck.swap(newFocus, gCursorFocus);
        gCursorFocus = -1;
    }
}

function initMain(canvasName, imagePath) {
    KAMO_IMAGE = new Image();
    KAMO_IMAGE.src = imagePath;
    KAMO_IMAGE.onload = function () {

        /* Create canvas to draw on: */
        var canvas = document.getElementById(canvasName);
        canvas.width = CANVAS_WIDTH
        canvas.height = CANVAS_HEIGHT
        canvas.addEventListener("click", handleEventClick, false);
        canvas.focus();
        gCanvasContext = canvas.getContext("2d");

        /* Init and draw gDeck */
        gDeck = new Deck();
        gDeck.draw();
     }

}

