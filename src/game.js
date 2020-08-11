const SPACING = 168; // Spacing between pieces
const WHITE = 1;
const BLACK = -1;
const BEGINNING = 140;
const END = 644;
const MIDDLE = (BEGINNING + END)/2;

var board;

class BoardScene extends Phaser.Scene{
    selectedPiece = null;
    pieces;  // All the game pieces stored in a group
    selectZones;  // The group that stores the sprites for selecting your piece's move
    lastPiece = null;
    turnNum;
    playerText;
    turnText;
    currentPlayer;
    
    constructor(){
        super({key: 'boardScene'})
    }
    preload(){
        this.load.image('black', './src/assets/black.png');
        this.load.image('white', './src/assets/white.png');
        this.load.image('gear', '/src/assets/gear.png');
    }
    create(){
        board= [[WHITE, null, null, BLACK],
                [null, WHITE, BLACK, null],
                [null, BLACK, WHITE, null],
                [BLACK, null, null, WHITE]];

        this.pieces = this.add.group();
        for(var i = 0; i < board.length; i++){
            for(var j = 0; j < board[i].length; j++){
                if (board[i][j] === WHITE){
                    var piece = this.pieces.create(i*SPACING+BEGINNING, j*SPACING+BEGINNING, 'white');
                    piece.name = 'piece' + i.toString() + 'x' + j.toString();
                    piece.setInteractive();
                    piece.on('clicked', this.select, this);
                }
                else if(board[i][j] === BLACK){
                    var piece = this.pieces.create(i*SPACING+BEGINNING, j*SPACING+BEGINNING, 'black');
                    piece.name = 'piece' + i.toString() + 'x' + j.toString();
                    piece.setInteractive();
                    piece.on('clicked', this.select, this);
                }
                
            }
        }

        this.input.on('gameobjectup', function (pointer, gameObject)
        {
            gameObject.emit('clicked', gameObject);
            gameObject.emit('moved', gameObject);
        }, this);

        var gear = this.add.sprite(END + 100, BEGINNING - 100, 'gear');
        gear.setScale(0.5);
        gear.setInteractive();
        gear.on('clicked', this.pause, this);
    
        // generate sprite for selection box 
        this.selectZones = this.add.group();
        var graphics = this.add.graphics();
        graphics.lineStyle(1, 0xFFFF00, 0.4);
        graphics.fillStyle(0xFFFF00, 0.4);
        graphics.fillRect(0, 0, 148, 148)
        graphics.strokeRect(0, 0, 148, 148);
        var texture = graphics.generateTexture('box', 148, 148)
        graphics.destroy();

        this.currentPlayer = WHITE

        this.turnNum = 1;

        this.playerText = this.add.text(68, 802, "White's Turn", {fontFamily: 'Verdana, Georgia, serif', fontSize: '52px', align: 'left'});
        this.turnText = this.add.text(END - 120, 802, 'Turn: ' +  this.turnNum, {fontFamily: 'Verdana, Georgia, serif', fontSize: '52px', align:'right'});
    }

    pause(action){
        this.scene.launch('pauseMenu');
        this.scene.pause();
    }

    select(piece){
        if((piece.texture.key === 'white' & this.currentPlayer === WHITE) || (piece.texture.key == 'black' & this.currentPlayer === BLACK)){
            if (piece == this.selectedPiece){
                piece.clearTint();
                this.selectedPiece = null;
                this.selectZones.clear(true, true);
            }
            else{
                if(this.selectedPiece != null){
                    this.selectedPiece.clearTint();
                    this.selectZones.clear(true, true);
                }
                this.selectedPiece = piece;
                piece.setTintFill(0xff0000);
                this.findPieces(this.pieces);
            }
        }
    }
    
    findPieces(groupArray){
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
        var j = groupArray.length;
        for(var i = 0; i < groupArray.length; i++) {
            j = j - 1;
            if(groupArray[i] !== this.selectedPiece){
                if(this.selectedPiece.y === groupArray[i].y){
                    if(groupArray[i].x < this.selectedPiece.x - SPACING){
                        leftPiece = groupArray[i];
                        noneLeft = false;
                    }
                    else if(groupArray[i].x === this.selectedPiece.x - SPACING){
                        noneLeft = false;
                    }
                } if(this.selectedPiece.y === groupArray[i].y & rightPiece === null){
                    if(groupArray[i].x > this.selectedPiece.x + SPACING){
                        rightPiece = groupArray[i];
                        noneRight = false;
                    }
                    else if (groupArray[i].x === this.selectedPiece.x + SPACING){
                        noneRight = false;
                    }
                } if (this.selectedPiece.x === groupArray[j].x & downPiece == null){
                    if(groupArray[j].y > this.selectedPiece.y + SPACING){
                        downPiece = groupArray[j];
                        noneDown = false;
                    }
                    else if(groupArray[j].y === this.selectedPiece.y + SPACING){
                        noneDown = false;
                    }
                } if(this.selectedPiece.x === groupArray[i].x){
                    if(groupArray[i].y < this.selectedPiece.y - SPACING){
                        upPiece = groupArray[i];
                        noneUp = false;
                    }
                    else if(groupArray[i].y === this.selectedPiece.y - SPACING){
                        noneUp = false;
                    }
                }
            }
        }

        //For loop checking pieces going up left diagonally
        // - x - y
        if (this.pieces.getChildren().find(piece => piece.x === this.selectedPiece.x - SPACING & piece.y === this.selectedPiece.y - SPACING) !== undefined){
            noneUpLeft = false;
        }
        var initialX = this.simplify(this.selectedPiece.x);
        var initialY = this.simplify(this.selectedPiece.y);
        var pairX;
        var pairY;
        for(var x = initialX - 1; x >= 0; x = x - 1){
            var counter = initialY;
            for(var y = initialY - 1; y >= counter - 1 && y >= 0; y = y - 1){
                initialY = y;
                pairX = x;
                pairY = y;
                var diagPiece = this.pieces.getChildren().find(piece => piece.x === this.makeCoordinate(x) & piece.y === this.makeCoordinate(y));
                if(noneUpLeft === true & diagPiece !== undefined){
                     noneUpLeft = false;
                    upLeftPiece = diagPiece;
                }                
            }
        }
        pairX = this.makeCoordinate(pairX);
        pairY = this.makeCoordinate(pairY);
        // none up left check
        if(noneUpLeft){
            this.activate(this.selectZones.create(pairX, pairY, 'box'))
        }

        //up right check
        if (this.pieces.getChildren().find(piece => piece.x === this.selectedPiece.x + SPACING & piece.y === this.selectedPiece.y - SPACING) !== undefined){
            noneUpRight = false;
        }
        var initialX = this.simplify(this.selectedPiece.x);
        var initialY = this.simplify(this.selectedPiece.y);
        var pairX;
        var pairY;
        for(var x = initialX + 1; x <= 3; x = x + 1){
            var counter = initialY;
            for(var y = initialY - 1; y >= counter - 1 && y >= 0; y = y - 1){
                initialY = y;
                pairX = x;
                pairY = y;
                var diagPiece = this.pieces.getChildren().find(piece => piece.x === this.makeCoordinate(x) & piece.y === this.makeCoordinate(y));
                if(noneUpRight === true & diagPiece !== undefined){
                     noneUpRight = false;
                    upRightPiece = diagPiece;
                }                
            }
        }
        pairX = this.makeCoordinate(pairX);
        pairY = this.makeCoordinate(pairY);
        // none up right check
        if(noneUpRight){
            this.activate(this.selectZones.create(pairX, pairY, 'box'))
        }

        // down left check
        if (this.pieces.getChildren().find(piece => piece.x === this.selectedPiece.x - SPACING & piece.y === this.selectedPiece.y + SPACING) !== undefined){
            noneDownLeft = false;
        }
        var initialX = this.simplify(this.selectedPiece.x);
        var initialY = this.simplify(this.selectedPiece.y);
        var difference = initialY - initialX;
        var pairX;
        var pairY;
        for(var x = initialX - 1; x >= 0; x = x - 1){
            var counter = initialY;
            for(var y = initialY + 1; y <= counter + 1 && y <= 3; y = y + 1){
                initialY = y;
                pairX = x;
                pairY = y;
                var diagPiece = this.pieces.getChildren().find(piece => piece.x === this.makeCoordinate(x) & piece.y === this.makeCoordinate(y));
                if(noneDownLeft === true & diagPiece !== undefined){
                     noneDownLeft = false;
                    downLeftPiece = diagPiece;
                }                
            }
        }
        pairX = this.makeCoordinate(pairX);
        pairY = this.makeCoordinate(pairY);
        // none down left check
        if(noneDownLeft){
            this.activate(this.selectZones.create(pairX, pairY, 'box'))
        }
        
        // down right check
        if (this.pieces.getChildren().find(piece => piece.x === this.selectedPiece.x + SPACING & piece.y === this.selectedPiece.y + SPACING) !== undefined){
            noneDownRight = false;
        }
        var initialX = this.simplify(this.selectedPiece.x);
        var initialY = this.simplify(this.selectedPiece.y);
        var pairX;
        var pairY;
        for(var x = initialX + 1; x <= 3; x = x + 1){
            var counter = initialY;
            for(var y = initialY + 1; y <= counter + 1 && y <= 3; y = y + 1){
                initialY = y;
                pairX = x;
                pairY = y;
                var diagPiece = this.pieces.getChildren().find(piece => piece.x === this.makeCoordinate(x) & piece.y === this.makeCoordinate(y));
                if(noneDownRight === true & diagPiece !== undefined){
                    noneDownRight = false;
                    downRightPiece = diagPiece;
                }                
            }
        }
        pairX = this.makeCoordinate(pairX);
        pairY = this.makeCoordinate(pairY);
        // none down right check
        if(noneDownRight){
            this.activate(this.selectZones.create(pairX, pairY, 'box'))
        }

        this.determineMoves(leftPiece, noneLeft, rightPiece, noneRight, upPiece, noneUp, downPiece, noneDown);
        this.determineDiagMoves(upLeftPiece, upRightPiece, downLeftPiece, downRightPiece);
    }
    
    /* Determine takes the pieces and boolean used to determine where to
     place selection zones relative to selected piece. */
    determineMoves(leftPiece, noneLeft, rightPiece, noneRight, upPiece, noneUp, downPiece, noneDown){
        var leftZone = null;
        //Check if the selected piece is on the left side of the board
        if (this.selectedPiece.x === BEGINNING) {
        } 
        // Checking if there is a piece to left and there isn't one directly next to selected piece 
        else if(leftPiece !== null & this.pieces.getChildren().find(piece => piece.x === this.selectedPiece.x - SPACING & piece.y === this.selectedPiece.y) === undefined){
            leftZone = this.selectZones.create(leftPiece.x + SPACING, leftPiece.y, 'box');
        } 
        // Case where there are no pieces to the left
        else if(noneLeft === true) {
            leftZone = this.selectZones.create(BEGINNING, this.selectedPiece.y, 'box');
        }
        // If a leftZone has been created, set it as interactive and set a listener.
        this.activate(leftZone);
    
        var rightZone = null;
        if (this.selectedPiece.x === END) {
        }
        else if(rightPiece !== null & this.pieces.getChildren().find(piece => piece.x === this.selectedPiece.x + SPACING & piece.y === this.selectedPiece.y) === undefined){
            rightZone = this.selectZones.create(rightPiece.x - SPACING, rightPiece.y, 'box');
        }else if(noneRight === true) {
            rightZone = this.selectZones.create(END, this.selectedPiece.y, 'box');
        }
        this.activate(rightZone);
     
        var upZone = null;
        if (this.selectedPiece.y === BEGINNING) {
        }
        else if(upPiece !== null & this.pieces.getChildren().find(piece => piece.x === this.selectedPiece.x & piece.y === this.selectedPiece.y - SPACING) === undefined){
            upZone = this.selectZones.create(upPiece.x, upPiece.y + SPACING, 'box');
        }else if(noneUp === true) {
            upZone = this.selectZones.create(this.selectedPiece.x, BEGINNING, 'box');
        }
        this.activate(upZone);
    
        var downZone = null;
        if (this.selectedPiece.y === END) {
        }
        else if(downPiece !== null & this.pieces.getChildren().find(piece => piece.x === this.selectedPiece.x & piece.y === this.selectedPiece.y + SPACING) === undefined){
            downZone = this.selectZones.create(downPiece.x, downPiece.y - SPACING, 'box');
        }else if(noneDown === true) {
            downZone = this.selectZones.create(this.selectedPiece.x, END, 'box');
        }
        this.activate(downZone);
    }
    
    determineDiagMoves(upLeftPiece, upRightPiece, downLeftPiece, downRightPiece){
        var upLeftZone = null;
        if(this.selectedPiece.x === BEGINNING || this.selectedPiece.y === BEGINNING){
    
        }
        else if(upLeftPiece !== null & this.pieces.getChildren().find(piece => piece.x === this.selectedPiece.x - SPACING & piece.y === this.selectedPiece.y - SPACING) === undefined){
            upLeftZone = this.selectZones.create(upLeftPiece.x + SPACING, upLeftPiece.y + SPACING, 'box');
        }
        this.activate(upLeftZone);
    
        var upRightZone = null;
        if(this.selectedPiece.x === END || this.selectedPiece.y === BEGINNING){
    
        }
        else if(upRightPiece !== null & this.pieces.getChildren().find(piece => piece.x === this.selectedPiece.x + SPACING & piece.y === this.selectedPiece.y - SPACING) === undefined){
            upRightZone = this.selectZones.create(upRightPiece.x - SPACING, upRightPiece.y + SPACING, 'box');
        }
        this.activate(upRightZone);
    
        var downLeftZone = null;
        if(this.selectedPiece.x === BEGINNING || this.selectedPiece.y === END){
    
        }
        else if(downLeftPiece !== null & this.pieces.getChildren().find(piece => piece.x === this.selectedPiece.x - SPACING & piece.y === this.selectedPiece.y + SPACING) === undefined){
            downLeftZone = this.selectZones.create(downLeftPiece.x + SPACING, downLeftPiece.y - SPACING, 'box');
        }
        this.activate(downLeftZone);
    
        var downRightZone = null;
        if(this.selectedPiece.x === END || this.selectedPiece.y === END){
        }
        else if(downRightPiece !== null & this.pieces.getChildren().find(piece => piece.x === this.selectedPiece.x + SPACING & piece.y === this.selectedPiece.y + SPACING) === undefined){
            downRightZone = this.selectZones.create(downRightPiece.x - SPACING, downRightPiece.y - SPACING, 'box');
        }
        this.activate(downRightZone);
    }
    
    // The function for handling the action of selecting a box to move a piece
    move(zone){
        this.selectedPiece.clearTint();
        board[this.simplify(zone.y)][this.simplify(zone.x)] = this.currentPlayer;
        board[this.simplify(this.selectedPiece.y)][this.simplify(this.selectedPiece.x)] = null;
        this.selectedPiece.x = zone.x;
        this.selectedPiece.y = zone.y;
        this.lastPiece = this.selectedPiece;
        this.selectedPiece = null;
        this.selectZones.clear(true, true);
    
        if(this.checkWin()){
            if(this.currentPlayer == WHITE){
                this.win('White');
            }
            else{
                this.win('Black');
            }
        }
        else if(this.checkEachCornerFail()){
            if(this.currentPlayer == 1){
                this.win('Black');
            }
            else{
                this.win('White');
            }
        }
        else{
            if (this.currentPlayer === BLACK){
                this.turnText.text = 'Turn: ' + (this.turnNum += 1);
                this.playerText.text = "White's Turn";
            }
            else{
                this.playerText.text = "Black's Turn";
            }
            this.currentPlayer = this.currentPlayer * -1;
        }
    }
    
    activate(zone){
        if (zone !== null){
            zone.setInteractive();
            zone.on('moved', this.move, this);
        }
    }
    
    simplify(coord){
        if(coord === BEGINNING){
            return coord - BEGINNING;
        } else {
            return (coord - BEGINNING) / SPACING;
        }
    }

    makeCoordinate(index){
        if(index === 0){
            return BEGINNING;
        } else{
            return (index * SPACING) + BEGINNING
        }
    }
    
    checkWin(){
        return (this.checkCorners() || this.checkSquare() || this.checkLine());
    }
    
    checkCorners(){
        if(board[0][0] === this.currentPlayer & board[0][3] === this.currentPlayer & board[3][0] === this.currentPlayer & board[3][3] === this.currentPlayer){
            return true;
        }
        return false;
    }
    
    checkSquare(){
        for(var i = 0; i < board.length - 1; i++){
            for(var j = 0; j < board[i].length -1; j++){
                var topL = board[i][j];
                var topR = board[i+1][j];
                var botL = board[i][j+1];
                var botR = board[i+1][j+1];
                if (topL === this.currentPlayer & topR === this.currentPlayer & botL === this.currentPlayer & botR === this.currentPlayer){
                    return true;
                }
            }
        }
        return false;
    }
    
    checkLine(){
        var row = this.simplify(this.lastPiece.y);
        var col = this.simplify(this.lastPiece.x);
        var horiz = true;
        var vert = true;
        for (var i = 0; i < board.length; i++){
            if (board[i][col] != this.currentPlayer){
                vert = false;
            }
            if(board[row][i] != this.currentPlayer){
                horiz = false;
            }
        }
        return (vert || horiz);
    }
    
    checkEachCornerFail(){
        for(var x = 0; x < board.length; x += 3){
            for(var y = 0; y < board[x].length; y +=3){
                if (board[x][y] === this.currentPlayer * -1){
                    if(this.checkCornerFail(x, y)){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    checkCornerFail(x, y){
        if(x === 0 & y === 0){
            if(board[x+1][y] == this.currentPlayer & board[x][y+1] == this.currentPlayer & board[x+1][y+1] == this.currentPlayer){
                return true;
            }
        }
        else if(x === 3 & y === 0){
            if(board[x - 1][y] == this.currentPlayer & board[x][y + 1] == this.currentPlayer & board[x - 1][y + 1] == this.currentPlayer){
                return true;
            }
        }
        else if (x === 0 & y === 3){
            if(board[x + 1][y] == this.currentPlayer & board[x][y - 1] == this.currentPlayer & board[x + 1][y - 1] == this.currentPlayer){
                return true;
            }
        }
        else{
            if(board[x - 1][y] == this.currentPlayer & board[x][y - 1] == this.currentPlayer & board[x - 1][y - 1] == this.currentPlayer){
                return true;
            }
        }
        return false;
    }
    
    win(player){
        this.scene.pause();
        this.scene.launch('winScreen', {winner: player});
    }
};


class MainMenu extends Phaser.Scene{
    constructor(){
        super({key: 'mainMenu', active: true})
    }
    create(){
        var daoTitle = this.add.text(75, 100, 'Dao Online', { fontFamily: 'Verdana, Georgia, serif', fontSize: '110px', align: 'center'});
        var localComp = this.add.text(150, 300, 'Local Game', { fontFamily: 'Verdana, Georgia, serif', fontSize: '80px', align: 'center'});
        localComp.setInteractive();
        localComp.on('clicked', this.play, this);
        this.input.on('gameobjectup', function (pointer, gameObject)
        {
            gameObject.emit('clicked', gameObject);
        }, this);
    }

    play(localComp){
        this.scene.stop('mainMenu');
        this.scene.restart('boardScene');
        this.scene.start('boardScene');
    }
};

class PauseMenu extends Phaser.Scene{
    constructor(){
        super({key: 'pauseMenu'})
    }
    preload(){
        this.load.image('overlay', '/src/assets/darken.png');
    }
    create(){
        var overlay = this.add.image(0, 0, 'overlay');
        var continueText = this.add.text(100, 250, 'Resume', {fontFamily: 'Verdana, Georgia, serif', fontSize: '60px'});
        continueText.setInteractive();
        continueText.on('clicked', this.continue, this);
        var mainMenu = this.add.text(100, 400, 'Exit to Main Menu', {fontFamily: 'Verdana, Georgia, serif', fontSize: '60px'});
        mainMenu.setInteractive();
        mainMenu.on('clicked', this.exit, this);
        this.input.on('gameobjectup', function(pointer, gameObject){
            gameObject.emit('clicked', gameObject);
        }, this);
    }

    exit(mainMenu){
        this.scene.stop();
        this.scene.stop('boardScene');
        this.scene.start('mainMenu');
    }
    continue(text){
        this.scene.stop();
        this.scene.resume('boardScene');
    }
}

class WinScreen extends Phaser.Scene{
    constructor(){
        super({key: 'winScreen'})
    }
    init(data){
        this.winner = data.winner;
    }
    preload(){
        this.load.image('overlay', '/src/assets/darken.png');
    }
    create(){
        var overlay = this.add.image(0, 0, 'overlay');
        var WinText = this.add.text(MIDDLE - 212, MIDDLE - 100, this.winner + ' Wins!', { fontFamily: 'Verdana, Georgia, serif', fontSize: '78px', align: 'center'});
        var returnText = this.add.text(BEGINNING - 50, MIDDLE + 75, 'Return to Main Menu', { fontFamily: 'Verdana, Georgia, serif', fontSize: '60px', align: 'center'});
        returnText.setInteractive();
        returnText.on('clicked', this.returnToMenu, this);
        this.input.on('gameobjectup', function(pointer, gameObject){
            gameObject.emit('clicked', gameObject);
        }, this);
    }
    returnToMenu(){
        this.scene.start('mainMenu');
        this.scene.stop('boardScene');
    }
}
var config = {
    type: Phaser.AUTO,
    width: 787,
    height: 902,
    backgroundColor: '#d4bd8a',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [MainMenu , BoardScene, PauseMenu, WinScreen],
};

var game = new Phaser.Game(config);