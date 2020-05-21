var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    backgroundColor: '#d4bd8a',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('black', 'assets/black.png');
    this.load.image('white', 'assets/white.png');
}

function create ()
{
    var board =[["white", "", "", "black"],
            ["", "white","black", ""],
            ["", "black", "white", ""],
            ["black", "", "", "white"]];

    for(i = 0; i < board.length; i++){
        for(j = 0; j < board[i].length; j++){
            if (board[i][j] === "white"){
                var sprite = this.add.sprite(i*200+100, j*200+100, 'white');
            }
            else if(board[i][j] === "black"){
                var sprite = this.add.sprite(i*200+100, j*200+100, 'black');
            }
        }
    }
}