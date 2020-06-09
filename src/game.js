const SPACING = 168; // Spacing between pieces
const WHITE = 1;
const BLACK = -1;
const BEGINNING = 100;
const END = 604;

var selectedPiece = null;
var pieces;  // All the game pieces stored in a group
var selectZones;  // The group that stores the sprites for selecting your piece's move
var board =[[WHITE, , , BLACK],
            [, WHITE, BLACK, ],
            [, BLACK, WHITE, ],
            [BLACK, , , WHITE]];

var currentPlayer;

var BoardScene = new Phaser.Class({
    Extends: Phaser.Scene,
    intialize:
    function BoardScene(){
        Phaser.Scene.call(this, {key: 'boardScene'})
    },
    preload: function(){
        this.load.image('black', './src/assets/black.png');
        this.load.image('white', './src/assets/white.png');
    },
    create: function(){
        pieces = this.add.group();
        for(i = 0; i < board.length; i++){
            for(j = 0; j < board[i].length; j++){
                if (board[i][j] === WHITE){
                    var piece = pieces.create(i*SPACING+BEGINNING, j*SPACING+BEGINNING, 'white');
                    piece.name = 'piece' + i.toString() + 'x' + j.toString();
                    piece.setInteractive();
                    piece.on('clicked', select, this);
                }
                else if(board[i][j] === BLACK){
                    var piece = pieces.create(i*SPACING+BEGINNING, j*SPACING+BEGINNING, 'black');
                    piece.name = 'piece' + i.toString() + 'x' + j.toString();
                    piece.setInteractive();
                    piece.on('clicked', select, this);
                }
                
            }
        }
        this.input.on('gameobjectup', function (pointer, gameObject)
        {
            gameObject.emit('clicked', gameObject);
            gameObject.emit('moved', gameObject);
        }, this);
    
        // generate sprite for selection box 
        selectZones = this.add.group();
        graphics = this.add.graphics();
        graphics.lineStyle(1, 0xFFFF00, 0.4);
        graphics.fillStyle(0xFFFF00, 0.4);
        graphics.fillRect(0, 0, 148, 148)
        graphics.strokeRect(0, 0, 148, 148);
        var texture = graphics.generateTexture('box', 148, 148)
        graphics.destroy();

        currentPlayer = WHITE;
    }
});

function select(piece){
    console.log(piece);
    if((piece.texture.key === 'white' & currentPlayer === WHITE) || (piece.texture.key == 'black' & currentPlayer === BLACK)){
        if (piece == selectedPiece){
            piece.clearTint();
            selectedPiece = null;
            selectZones.clear(true, true);
        }
        else{
            if(selectedPiece != null){
                selectedPiece.clearTint();
                selectZones.clear(true, true);
            }
            selectedPiece = piece;
            piece.setTintFill(0xff0000);
            findPieces(pieces);
        }
    }
}

function findPieces(groupArray){
    var leftPiece = null;
    var noneLeft = true;
    var rightPiece = null;
    var noneRight = true;
    var upPiece = null;
    var noneUp = true;
    var downPiece = null;
    var noneDown = true;
    var groupArray = groupArray.children.entries;
    for(i = 0; i < groupArray.length; i++) {
        if(groupArray[i] !== selectedPiece){
            if(selectedPiece.y === groupArray[i].y){
                if(groupArray[i].x < selectedPiece.x - SPACING){
                    leftPiece = groupArray[i];
                    noneLeft = false;
                }
                else if(groupArray[i].x === selectedPiece.x - SPACING){
                    noneLeft = false;
                }
            } if(selectedPiece.y === groupArray[i].y & rightPiece === null){
                if(groupArray[i].x > selectedPiece.x + SPACING){
                    rightPiece = groupArray[i];
                    noneRight = false;
                }
                else if (groupArray[i].x === selectedPiece.x + SPACING){
                    noneRight = false;
                }
            } if (selectedPiece.x === groupArray[i].x & downPiece == null){
                if(groupArray[i].y > selectedPiece.y + SPACING){
                    downPiece = groupArray[i];
                    noneDown = false;
                }
                else if(groupArray[i].y === selectedPiece.y + SPACING){
                    noneDown = false;
                }
            } if(selectedPiece.x === groupArray[i].x){
                if(groupArray[i].y < selectedPiece.y - SPACING){
                    upPiece = groupArray[i];
                    noneUp = false;
                }
                else if(groupArray[i].y === selectedPiece.y - SPACING){
                    noneUp = false;
                }
            }
        }
    }
    determineMoves(leftPiece, noneLeft, rightPiece, noneRight, upPiece, noneUp, downPiece, noneDown);
}

/* Determine takes the pieces and boolean used to determine where to
 place selection zones relative to selected piece. */
function determineMoves(leftPiece, noneLeft, rightPiece, noneRight, upPiece, noneUp, downPiece, noneDown){
    var leftZone = null;
    //Check if the selected piece is on the left side of the board
    if (selectedPiece.x === BEGINNING) {
    } 
    // Checking if there is a piece to left and there isn't one directly next to selected piece 
    else if(leftPiece !== null & pieces.getChildren().find(piece => piece.x === selectedPiece.x - SPACING & piece.y === selectedPiece.y) === undefined){
        leftZone = selectZones.create(leftPiece.x + SPACING, leftPiece.y, 'box');
    } 
    // Case where there are no pieces to the left
    else if(noneLeft === true) {
        leftZone = selectZones.create(BEGINNING, selectedPiece.y, 'box');
    }
    // If a leftZone has been created, set it as interactive and set a listener.
    if(leftZone !== null){
        leftZone.setInteractive();
        leftZone.on('moved', move, this);
    }

    var rightZone = null;
    if (selectedPiece.x === END) {
    }
    else if(rightPiece !== null & pieces.getChildren().find(piece => piece.x === selectedPiece.x + SPACING & piece.y === selectedPiece.y) === undefined){
        rightZone = selectZones.create(rightPiece.x - SPACING, rightPiece.y, 'box');
    }else if(noneRight === true) {
        rightZone = selectZones.create(END, selectedPiece.y, 'box');
    }
    if(rightZone !== null){
        rightZone.setInteractive();
        rightZone.on('moved', move, this);
    }
 
    var upZone = null;
    if (selectedPiece.y === BEGINNING) {
    }
    else if(upPiece !== null & pieces.getChildren().find(piece => piece.x === selectedPiece.x & piece.y === selectedPiece.y - SPACING) === undefined){
        upZone = selectZones.create(upPiece.x, upPiece.y + SPACING, 'box');
    }else if(noneUp === true) {
        upZone = selectZones.create(selectedPiece.x, BEGINNING, 'box');
    }
    if(upZone !== null){
        upZone.setInteractive();
        upZone.on('moved', move, this);
    }

    var downZone = null;
    if (selectedPiece.y === END) {
    }
    else if(downPiece !== null & pieces.getChildren().find(piece => piece.x === selectedPiece.x & piece.y === selectedPiece.y + SPACING) === undefined){
        downZone = selectZones.create(downPiece.x, downPiece.y - SPACING, 'box');
    }else if(noneDown === true) {
        downZone = selectZones.create(selectedPiece.x, END, 'box');
    }
    if(downZone !== null){
        downZone.setInteractive();
        downZone.on('moved', move, this);
    }
}

function move(zone){
    selectedPiece.clearTint();
    console.log(board);
    console.log(selectedPiece.x);
    console.log(convertToSimple(selectedPiece.x));
    console.log(convertToSimple(selectedPiece.y));
    console.log(convertToSimple(zone.x))
    console.log(zone.x);
    board[convertToSimple(zone.x)][convertToSimple(zone.y)] = currentPlayer;
    board[convertToSimple(selectedPiece.x)].splice(convertToSimple(selectedPiece.y), 1);
    selectedPiece.x = zone.x;
    selectedPiece.y = zone.y;
    selectedPiece = null;
    selectZones.clear(true, true);
    if (currentPlayer === WHITE){
        checkWin();
    }
    else{
        checkWin();
    }
    currentPlayer = currentPlayer * -1;
}

function convertToSimple(coord){
    if(coord === BEGINNING){
        return coord - BEGINNING;
    }
    else{
        return (coord - BEGINNING) / SPACING;
    }
}

function checkWin(){

}

var config = {
    type: Phaser.AUTO,
    width: 702,
    height: 702,
    backgroundColor: '#d4bd8a',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: BoardScene
};

var game = new Phaser.Game(config);