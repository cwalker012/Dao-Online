var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    backgroundColor: '#d4bd8a',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
var selectedPiece = null;
var pieces;
var board =[["white", "", "", "black"],
            ["", "white","black", ""],
            ["", "black", "white", ""],
            ["black", "", "", "white"]];


function preload ()
{
    this.load.image('black', './src/assets/black.png');
    this.load.image('white', './src/assets/white.png');
}

function create ()
{
    pieces = this.add.group();
    for(i = 0; i < board.length; i++){
        for(j = 0; j < board[i].length; j++){
            if (board[i][j] === "white"){
                var piece = pieces.create(i*200+100, j*200+100, 'white');
                piece.name = 'piece' + i.toString() + 'x' + j.toString();
                piece.setInteractive();
                //setPos(piece, i, j);
                piece.on('clicked', select, this);
            }
            else if(board[i][j] === "black"){
                var piece = pieces.create(i*200+100, j*200+100, 'black');
                piece.name = 'piece' + i.toString() + 'x' + j.toString();
                piece.setInteractive();
                //setPos(piece, i, j);
                piece.on('clicked', select, this);
            }
            
        }
    }
    this.input.on('gameobjectup', function (pointer, gameObject)
    {
        gameObject.emit('clicked', gameObject);
    }, this);
}

function select(piece){
    if (piece == selectedPiece){
        piece.clearTint();
        selectedPiece = null;
    }
    else{
        selectedPiece = piece;
        piece.setTintFill(0xff0000);
    }
    console.log(piece);
    console.log('wow');
}