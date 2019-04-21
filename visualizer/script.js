var player = document.getElementById('player');
var canvas = document.getElementById('myCanvas');
var canvasCtx = canvas.getContext('2d');
var WIDTH = canvasCtx.canvas.width  = window.innerWidth;
var HEIGHT = canvasCtx.canvas.height = window.innerHeight;

var handleSuccess = function(stream) {
    var context = new AudioContext();
    var source = context.createMediaStreamSource(stream);
    var processor = context.createScriptProcessor(1024, 1, 1);
    var analyser = context.createAnalyser();
    var bufferLength = 256;//analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);

    analyser.fftSize = 1024;
    source.connect(analyser);
    processor.connect(context.destination);

    //canvasCtx.shadowBlur = 10;
    //canvasCtx.shadowColor = "black";

     
    function draw() {

    	drawVisual = requestAnimationFrame(draw);
    	analyser.getByteFrequencyData(dataArray);
    	canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    	canvasCtx.translate(WIDTH / 2, HEIGHT / 2);

    	var radius = 150 + Math.floor(dataArray[1]) * 0.25;    	
    	var barHeight;
    	var barWidth = ( 2 * Math.PI * radius ) / bufferLength;
    	var radians = (2 * Math.PI ) / bufferLength;
        
    	
    	for(var i = 0; i < bufferLength;  i++) {
    		var angle = i * radians;
    		barHeight = dataArray[i];
    		canvasCtx.rotate(angle);
    		canvasCtx.fillStyle = 'rgb(' + (barHeight -75) + ',0,0)';
    		canvasCtx.fillRect(radius , -barWidth / 2, Math.min(200, barHeight), barWidth);
    	}
    	canvasCtx.translate(-WIDTH / 2, -HEIGHT / 2);
    }
    draw();
};


navigator.mediaDevices.getUserMedia({ audio: true, video: false })
	.then(handleSuccess);