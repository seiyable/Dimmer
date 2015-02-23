//=========== global variables ===========
var axis_baseX = 0.05;
var axis_baseY = 0.90;
var axis_topY = 0.05;
var maxY = 0.1;

var point1_x = axis_baseX, point1_y = maxY;
var point2_x = 0.2, point2_y = maxY;
var point3_x = 0.7, point3_y = 0.8;
var point4_x = 2, point4_y = 0.8;


//=========== setup() ===========
function setup() {
	//create a canvas
	var graphAreaWidth = $("#manual-brightness-area").width();
	var graphAreaHeight = $("#manual-brightness-area").height();
	console.log(graphAreaHeight);
  	var myCanvas = createCanvas(graphAreaWidth, graphAreaHeight);

  	//move the canvas inside the div of graph-area
  	myCanvas.id("graph1");
  	$("#manual-brightness-area").append($("#graph1"));
  	$("#graph1").removeAttr("style");

  	// $("#manual-brightness-area").append($("#graph"));
  	

}

//=========== setup() ===========
function draw() {
	background(255,255,0);
	// //axis
	// line(width * axis_baseX, height * axis_topY, width * axis_baseX, height * axis_baseY);
	// line(width * axis_baseX, height * axis_baseY, width, height * axis_baseY);

	// //graph
	// line(width * point1_x, height * point1_y, width * point2_x, height * point2_y);
	// line(width * point2_x, height * point2_y, width * point3_x, height * point3_y);
	// line(width * point3_x, height * point3_y, width * point4_x, height * point4_y);

	// //supportive lines
	// stroke(160);
	// line(width * point2_x, height * point2_y, width * point2_x, height * axis_baseY);
	// line(width * point3_x, height * point3_y, width * point3_x, height * axis_baseY);
	// stroke(0);

	//circles
	// fill(80);
	// var r = 0.05 * width;
	// ellipse(width * point2_x, height * point2_y, r, r);
	// ellipse(width * point3_x, height * point3_y, r, r);

	// fill(160);
	// var r = 0.03 * width;
	// ellipse(width * point2_x, height * axis_baseY, r, r);
	// ellipse(width * point3_x, height * axis_baseY, r, r);

}

function mouseDragged(){
	console.log("mouse dragged");
	// var r = 0.05 * width;
	// if (abs(mouseX - width * point2_x) < r && abs(mouseY - height * point2_y) < r){
	// 	if(mouseReleased()){
	// 		if(mouseX > 0 && mouseX < width){
	// 			point2_x = mouseX / width;
	// 		}
	// 	}
	// }
}
