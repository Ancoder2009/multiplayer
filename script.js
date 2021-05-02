var myplayer;
var player2;
var players = [];
var server;
var myplayernum;
var times = 0;
const speed = 8;
const print = console.log
function create(){
    const msgdiv = document.getElementById("message");
}

window.onbeforeunload = function() {
    server.onclose = function () {};
    server.close();
};
function StartGame(){
    server = new WebSocket("wss://MultiplayerEngine.ancoder.repl.co");
    server.onopen = function(event){
        server.send("{}")
        multiplayer.start();
        myplayer = new component(30, 30, "red", 0, 0);
        myplayer.update()
        update()
        player2 = new component(30, 30, "blue", 0, 0);
        player2.update();
        update();
        getMovements();
    }
    server.onmessage = function(event){
        console.log(event.data)
        if(times == 0){
            accepted = JSON.parse(event.data);
            myplayernum = accepted["player"];
            times = times + 1;
        } else {
            var newpos = JSON.parse(event.data)
            myplayer.x = newpos[JSON.stringify(myplayernum)]['x'];
            myplayer.y = newpos[JSON.stringify(myplayernum)]['y'];
            if(myplayernum == 1){
                player2.x = newpos['2']['x'];
                player2.y = newpos['2']['y'];
            }else if(myplayernum == 2){
                player2.x = newpos['1']['x'];
                player2.y = newpos['1']['y'];
            } 
            myplayer.update();
            player2.update();
            update();
            console.log("Updated!")
    }
    server.onclose = function(event){
        multiplayer.clear()
        msgdiv.innerHTML = "Connection Lost!"
    }
}}

var multiplayer = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 420;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function component(width, height, color, x, y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.update = function(){
        ctx = multiplayer.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
  }
    players.push(this)
}


function update(){
    multiplayer.clear()
    for (i in players) {
        players[i].update();
    }
}

function move(obj, x, y) {
    obj.x = x;
    obj.y = y;
};

function getMovements() {
    document.addEventListener("keydown", function(event){
        if(event.key == 'ArrowUp'){
            myplayer.y -= speed;
        }
        if(event.key == 'ArrowDown'){
            myplayer.y += speed;
        }
        if(event.key == 'ArrowLeft'){
            myplayer.x -= speed;
        }
        if(event.key == 'ArrowRight'){
            myplayer.x += speed;
        }
        server.send(JSON.stringify({method:"updatepos", x:myplayer.x, y:myplayer.y}))
        myplayer.update()
        update()
    });

};