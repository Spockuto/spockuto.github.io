var player = document.getElementById('player');
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var width = ctx.canvas.width  = window.innerWidth;
var height = ctx.canvas.height = window.innerHeight;
var regions = 4;
var density  = 300;
var spread = 20;


function getRand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generate(){
    ctx.fillStyle = "#3500DC";
    ctx.fillRect(0, 0, width, height);
    
    for(i = 0; i <  regions; i++){
        x = getRand(0, width);
        y = getRand(0, height);
    
        for (j = 0 ; j < density; j++){
            x += getRand(0 - spread, spread);
            y += getRand(0 - spread, spread);
            radius =  getRand(2, spread);
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 *  Math.PI);
            ctx.fill();
        }
    }
    
}

function Spread(value){
    spread = value;
}

function Density(value){
    density = value;
}

function Region(value){
    regions = value;
}

generate();