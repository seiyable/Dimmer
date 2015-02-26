//=========== global variables ===========


//=========== setup() ===========
function setup() {
	//create a canvas
	var graphAreaWidth = $("#manual-brightness-area").width();
	var graphAreaHeight = $("#manual-brightness-area").height();
	console.log(graphAreaHeight);
  	var myCanvas = createCanvas(graphAreaWidth, graphAreaHeight);

  	//move the canvas inside the div of graph-area
  	myCanvas.id("manual-brightness");
  	$("#manual-brightness-area").append($("#manual-brightness"));
  	$("#manual-brightness").removeAttr("style");

  	backImage = loadImage("../img/manual_bg.png");
}

//=========== setup() ===========
function draw() {
	var graphAreaWidth = $("#manual-brightness-area").width();
	var graphAreaHeight = $("#manual-brightness-area").height();

	var compressedRate = graphAreaHeight/800;
	image(backImage, 0, 0, 2000*compressedRate, graphAreaHeight);




}

function mouseDragged(){
	console.log("mouse dragged");

}
