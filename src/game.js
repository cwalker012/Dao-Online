const SPACING = 168; // Spacing between pieces
const WHITE = 1;
const BLACK = -1;
const BEGINNING = 100;
const END = 604;

var selectedPiece = null;
var pieces;  // All the game pieces stored in a group
var selectZones;  // The group that stores the sprites for selecting your piece's move
var board =[[WHITE, null, null, BLACK],
            [null, WHITE, BLACK, null],
            [null, BLACK, WHITE, null],
            [BLACK, null, null, WHITE]];
var lastPiece = null;
var whiteWinText;
var blackWinText;
var overlay;
var turnNum;
var playerText;
var turnText;
console.log(board);

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
        this.load.image('overlay', '/src/assets/darken.png')
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

        var middle = (BEGINNING + END)/2;
        whiteWinText = this.add.text(middle - 160, middle - 25, 'White Wins!', { fontFamily: 'Verdana, Georgia, serif', fontSize: '60px', align: 'center'}).setVisible(false);
        blackWinText = this.add.text(middle - 160, middle - 25, 'Black Wins!', { fontFamily: 'Verdana, Georgia, serif', fontSize: '60px', align: 'center'}).setVisible(false);
        whiteWinText.setDepth(1);
        blackWinText.setDepth(1);

        overlay = this.add.image(0, 0, 'overlay').setVisible(false);
        
        currentPlayer = WHITE

        turnNum = 1;

        playerText = this.add.text(25, 752, "White's Turn", {fontFamily: 'Verdana, Georgia, serif', fontSize: '55px', align: 'left'});
        turnText = this.add.text(END - 170, 752, 'Turn: ' +  turnNum, {fontFamily: 'Verdana, Georgia, serif', fontSize: '55px', align:'right'});
    }
});

function select(piece){
    console.log(piece.y);
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
    var upLeftPiece = null;
    var noneUpLeft = true;
    var upRightPiece = null;
    var noneUpRight = true;
    var downLeftPiece = null;
    var noneDownLeft = true;
    var downRightPiece = null;
    var noneDownRight = true;
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
    //For loop checking pieces going up left diagonally
    // - x - y
    if (pieces.getChildren().find(piece => piece.x === selectedPiece.x - SPACING & piece.y === selectedPiece.y - SPACING) !== undefined){
        noneUpLeft = false;
    }
    var y = selectedPiece.y - SPACING;
    var subY = true;
    for(var x = selectedPiece.x - SPACING*2; x >= BEGINNING; x = x - SPACING){
        y = y - SPACING;
        subY = false;
        if(y > BEGINNING){
            diagPiece = pieces.getChildren().find(piece => piece.x === x & piece.y === y);
            if(noneUpLeft === true & diagPiece !== undefined){
                noneUpLeft = false;
                upLeftPiece = diagPiece;
            }
            else{
                subY = true;
            }
        }
        else {
            subY = true;
            break;
        }
    }
    if(selectedPiece.x !== BEGINNING & selectedPiece.y !== BEGINNING){
        if(noneUpLeft & subY === false){
            console.log('here');
            activate(selectZones.create(x + SPACING, y + SPACING, 'box'))
        }
        else if(noneUpLeft & subY){
            console.log(x - selectedPiece.x + " x");
            console.log(y - selectedPiece.y + " y");
            if(x - selectedPiece.x === y - selectedPiece.y){
                activate(selectZones.create(x + SPACING, y + SPACING, 'box')) 
            }
            else{
                activate(selectZones.create(x + SPACING, y, 'box'))
            }
        }
    }  
    
    if (pieces.getChildren().find(piece => piece.x === selectedPiece.x + SPACING & piece.y === selectedPiece.y - SPACING) !== undefined){
        noneUpRight = false;
    }
    var y = selectedPiece.y - SPACING;
    for(x = selectedPiece.x + SPACING*2; x <= END; x = x + SPACING){
        y = y - SPACING;
        diagPiece = pieces.getChildren().find(piece => piece.x === x & piece.y === y);
        if(noneUpRight === true & diagPiece !== undefined){
            noneUpRight = false;
            upRightPiece = diagPiece;
        }
    }
    if (pieces.getChildren().find(piece => piece.x === selectedPiece.x - SPACING & piece.y === selectedPiece.y + SPACING) !== undefined){
        noneUpRight = false;
    }
    var y = selectedPiece.y + SPACING;
    for(x = selectedPiece.x - SPACING*2; x >= BEGINNING; x = x - SPACING){
        y = y + SPACING;
        diagPiece = pieces.getChildren().find(piece => piece.x === x & piece.y === y);
        if(noneDownLeft === true & diagPiece !== undefined){
            noneDownLeft = false;
            downLeftPiece = diagPiece;
        }
    }

    if (pieces.getChildren().find(piece => piece.x === selectedPiece.x + SPACING & piece.y === selectedPiece.y + SPACING) !== undefined){
        noneUpRight = false;
    }
    var y = selectedPiece.y + SPACING;
    for(x = selectedPiece.x + SPACING*2; x <= END; x = x + SPACING){
        y = y + SPACING;
        diagPiece = pieces.getChildren().find(piece => piece.x === x & piece.y === y);
        if(noneDownRight === true & diagPiece !== undefined){
            noneDownRight = false;
            downRightPiece = diagPiece;
        }
    }
    determineMoves(leftPiece, noneLeft, rightPiece, noneRight, upPiece, noneUp, downPiece, noneDown);
    determineDiagMoves(upLeftPiece, noneUpLeft, upRightPiece, noneUpRight, downLeftPiece, noneDownLeft, downRightPiece, noneDownRight);
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
    activate(leftZone);

    var rightZone = null;
    if (selectedPiece.x === END) {
    }
    else if(rightPiece !== null & pieces.getChildren().find(piece => piece.x === selectedPiece.x + SPACING & piece.y === selectedPiece.y) === undefined){
        rightZone = selectZones.create(rightPiece.x - SPACING, rightPiece.y, 'box');
    }else if(noneRight === true) {
        rightZone = selectZones.create(END, selectedPiece.y, 'box');
    }
    activate(rightZone);
 
    var upZone = null;
    if (selectedPiece.y === BEGINNING) {
    }
    else if(upPiece !== null & pieces.getChildren().find(piece => piece.x === selectedPiece.x & piece.y === selectedPiece.y - SPACING) === undefined){
        upZone = selectZones.create(upPiece.x, upPiece.y + SPACING, 'box');
    }else if(noneUp === true) {
        upZone = selectZones.create(selectedPiece.x, BEGINNING, 'box');
    }
    activate(upZone);

    var downZone = null;
    if (selectedPiece.y === END) {
    }
    else if(downPiece !== null & pieces.getChildren().find(piece => piece.x === selectedPiece.x & piece.y === selectedPiece.y + SPACING) === undefined){
        downZone = selectZones.create(downPiece.x, downPiece.y - SPACING, 'box');
    }else if(noneDown === true) {
        downZone = selectZones.create(selectedPiece.x, END, 'box');
    }
    activate(downZone);
}

function determineDiagMoves(upLeftPiece, upRightPiece, downLeftPiece, downRightPiece){
    var upLeftZone = null;
    if(selectedPiece.x === BEGINNING || selectedPiece.y === BEGINNING){

    }
    else if(upLeftPiece !== null & pieces.getChildren().find(piece => piece.x === selectedPiece.x - SPACING & piece.y === selectedPiece.y - SPACING) === undefined){
        upLeftZone = selectZones.create(upLeftPiece.x + SPACING, upLeftPiece.y + SPACING, 'box');
    }
    activate(upLeftZone);

    var upRightZone = null;
    if(selectedPiece.x === END || selectedPiece.y === BEGINNING){

    }
    else if(upRightPiece !== null & pieces.getChildren().find(piece => piece.x === selectedPiece.x + SPACING & piece.y === selectedPiece.y - SPACING) === undefined){
        upRightZone = selectZones.create(upRightPiece.x - SPACING, upRightPiece.y + SPACING, 'box');
    }
    activate(upRightZone);

    var downLeftZone = null;
    if(selectedPiece.x === BEGINNING || selectedPiece.x === BEGINNING){

    }
    else if(downLeftPiece !== null & pieces.getChildren().find(piece => piece.x === selectedPiece.x - SPACING & piece.y === selectedPiece.y + SPACING) === undefined){
        downLeftZone = selectZones.create(downLeftPiece.x + SPACING, downLeftPiece.y - SPACING, 'box');
    }
    activate(downLeftZone);

    var downRightZone = null;
    if(selectedPiece.x === BEGINNING || selectedPiece.x === BEGINNING){

    }
    else if(downRightPiece !== null & pieces.getChildren().find(piece => piece.x === selectedPiece.x - SPACING & piece.y === selectedPiece.y + SPACING) === undefined){
        downRightZone = selectZones.create(downRightPiece.x + SPACING, downRightPiece.y - SPACING, 'box');
    }
    activate(downRightZone);
}

// The function for handling the action of selecting a box to move a piece
function move(zone){
    selectedPiece.clearTint();
    board[simplify(zone.y)][simplify(zone.x)] = currentPlayer;
    board[simplify(selectedPiece.y)][simplify(selectedPiece.x)] = null;
    selectedPiece.x = zone.x;
    selectedPiece.y = zone.y;
    lastPiece = selectedPiece;
    selectedPiece = null;
    selectZones.clear(true, true);

    if(checkWin()){
        if(currentPlayer == 1){
            win('White');
        }
        else{
            win('Black');
        }
    }
    else if(checkEachCornerFail()){
        if(currentPlayer == 1){
            win('Black');
        }
        else{
            win('White');
        }
    }
    else{
        if (currentPlayer === BLACK){
            turnText.text = 'Turn: ' + (turnNum += 1);
            playerText.text = "White's Turn";
        }
        else{
            playerText.text = "Black's Turn";
        }
        currentPlayer = currentPlayer * -1;
    }
}

function activate(zone){
    if (zone !== null){
        zone.setInteractive();
        zone.on('moved', move, this);
    }
}

function simplify(coord){
    if(coord === BEGINNING){
        return coord - BEGINNING;
    } else {
        return (coord - BEGINNING) / SPACING;
    }
}

function checkWin(){
    return (checkCorners() || checkSquare() || checkLine());
}

function checkCorners(){
    console.log(board);
    if(board[0][0] === currentPlayer & board[0][3] === currentPlayer & board[3][0] === currentPlayer & board[3][3] === currentPlayer){
        return true;
    }
    return false;
}

function checkSquare(){
    for(i = 0; i < board.length - 1; i++){
        for(j = 0; j < board[i].length -1; j++){
            topL = board[i][j];
            topR = board[i+1][j];
            botL = board[i][j+1];
            botR = board[i+1][j+1];
            if (topL === currentPlayer & topR === currentPlayer & botL === currentPlayer & botR === currentPlayer){
                return true;
            }
        }
    }
    return false;
}

function checkLine(){
    var row = simplify(lastPiece.y);
    var col = simplify(lastPiece.x);
    var horiz = true;
    var vert = true;
    for (i = 0; i < board.length; i++){
        if (board[i][col] != currentPlayer){
            vert = false;
        }
        if(board[row][i] != currentPlayer){
            horiz = false;
        }
    }
    return (vert || horiz);
}

function checkEachCornerFail(){
    for(x = 0; x < board.length; x += 3){
        for(y = 0; y < board[x].length; y +=3){
            if (board[x][y] === currentPlayer * -1){
                if(checkCornerFail(x, y)){
                    return true;
                }
            }
        }
    }
    return false;
}

function checkCornerFail(x, y){
    if(x === 0 & y === 0){
        if(board[x+1][y] == currentPlayer & board[x][y+1] == currentPlayer & board[x+1][y+1] == currentPlayer){
            return true;
        }
    }
    else if(x === 3 & y === 0){
        if(board[x - 1][y] == currentPlayer & board[x][y + 1] == currentPlayer & board[x - 1][y + 1] == currentPlayer){
            return true;
        }
    }
    else if (x === 0 & y === 3){
        if(board[x + 1][y] == currentPlayer & board[x][y - 1] == currentPlayer & board[x + 1][y - 1] == currentPlayer){
            return true;
        }
    }
    else{
        if(board[x - 1][y] == currentPlayer & board[x][y - 1] == currentPlayer & board[x - 1][y - 1] == currentPlayer){
            return true;
        }
    }
    return false;
}

function win(player){
    if(player === 'White'){
        overlay.setVisible(true);
        whiteWinText.setVisible(true);
    }
    else{
        overlay.setVisible(true);
        blackWinText.setVisible(true);
    }
}

var config = {
    type: Phaser.AUTO,
    width: 702,
    height: 852,
    backgroundColor: '#d4bd8a',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: BoardScene
};

var game = new Phaser.Game(config);
game.scene.start('boardScene');