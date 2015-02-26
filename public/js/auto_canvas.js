//=========== notes ===========
/*

We use 6 points to draw a graph on the canvas.(point1 ~ point6)
The image shown below represents which point is which.

|
<1>______<2>
|        |\
|        | \
|        |  \
|        |   \
|        |    \
|        |     \<3>_____<4>
|        |     |
|________|_____|________
        <5>   <6>


The canvas size is responsive and determined by window size of the browser.
So, each variable for defining some length is represented not in px but in percentage of the canvas size.

*/

//=========== global variables ===========
//graph area
var graph_originX = 0.06, graph_originY = 0.87; //coordinates of the graph's origin point
var graph_topY = 0.05; //top of the graph area
var graph_maxY = 0.1; //if a point has max value, where is it dipicted?

//points
var point2_x = 0.2, point2_y = graph_maxY; //initial coordinates of point 2
var point1_x = graph_originX, point1_y = point2_y; //initial coordinates of point 1
var point3_x = 0.8, point3_y = 0.8; //initial coordinates of point 3
var point4_x = 1.0, point4_y = point3_y; //initial coordinates of point 4
var point5_x = point2_x, point5_y = graph_originY; //initial coordinates of point 5
var point6_x = point3_x, point6_y = graph_originY; //initial coordinates of point 6

//current time bar
var currentTimeBarX = 0.5; //X coordinate of current time bar

// images
var backImage;
var arrow_left_right;
var arrow_up_down;

//=========== setup() ===========
function setup() {
	//create a canvas
	var graphAreaWidth = $("#graph-area").width(); //get the width of the parent div
	var graphAreaHeight = $("#graph-area").height(); //get the height of the parent div
	console.log("height: " + graphAreaHeight + " width: " + graphAreaWidth);
  	var myCanvas = createCanvas(graphAreaWidth, graphAreaHeight); //create the canvas with those values

  	//move the canvas inside the div of graph-area
  	myCanvas.id("graph");
  	$("#graph-area").append($("#graph"));
  	$("#graph").removeAttr("style");

  	//load images
	backImage = loadImage("../img/graph.png");
	arrow_left_right=loadImage("../img/arrow_left_right.png");
    arrow_up_down = loadImage("../img/arrow_up.png");

    //change color mode
    colorMode(HSB, 359, 100, 100, 100);

}

//=========== draw() ===========
function draw() {
	//set the background image
	var graphAreaWidth = $("#graph-area").width(); //get the width of the parent div
	var graphAreaHeight = $("#graph-area").height(); //get the height of the parent div
	var compressedRate = graphAreaHeight/800; //get the compressed rate of bg image (original size is 6179*800)
	image(backImage, 0, 0, 6179*compressedRate, graphAreaHeight);

	//fill the graph
	noStroke();
	fill(colorSelected.h, colorSelected.s, colorSelected.v, 60); //fill is same color as the selected color button
	rect(point1_x * width, point1_y * height, (point2_x - point1_x) * width, (graph_originY - point1_y) * height); //rectangle at left side
	rect(point3_x * width, point3_y * height, (width - point3_x) * width, (graph_originY - point3_y) * height); // rectangle at right side

	if(point2_y < point3_y){
		//when point2 is at left to point3
		rect(point2_x * width, point3_y * height, (point3_x - point2_x) * width, (graph_originY - point3_y) * height);
		triangle(point2_x * width, point2_y * height, point3_x * width, point3_y * height, point2_x * width, point3_y * height);
	} else {
		//when point2 is at left to point3
		rect(point2_x * width, point2_y * height, (point3_x - point2_x) * width, (graph_originY - point2_y) * height);
		triangle(point2_x * width, point2_y * height, point3_x * width, point3_y * height, point3_x * width, point2_y * height);
	}
	stroke(1);

	//draw current time bar
	line(width * currentTimeBarX, height * graph_maxY, width * currentTimeBarX, height * graph_originY);

	//draw axis
	line(width * graph_originX, height * graph_topY, width * graph_originX, height * graph_originY);
	line(width * graph_originX, height * graph_originY, width, height * graph_originY);

	//draw vertical lines
	line(width * point2_x, height * point2_y, width * point5_x, height * point5_y);
	line(width * point3_x, height * point3_y, width * point6_x, height * point6_y);

	//draw up & down arrow images
	push();
	translate(-arrow_up_down.width/4, -arrow_up_down.height/4 - 0.02*height); //adjust the position
	image(arrow_up_down, width * point2_x, height * point2_y, arrow_up_down.width/2, arrow_up_down.height/2);//arrow image for point 2
	image(arrow_up_down, width * point3_x, height * point3_y, arrow_up_down.width/2, arrow_up_down.height/2);//arrow image for point 3
	pop();

	//draw left & right arrow images
	push();
	translate(-arrow_left_right.width/4, -arrow_left_right.height/4);//adjust the position
	image(arrow_left_right, width*point5_x, height * graph_originY, arrow_left_right.width/2,arrow_left_right.height/2);//arrow image for point 5	
	image(arrow_left_right, width*point6_x, height * graph_originY, arrow_left_right.width/2, arrow_left_right.height/2);//arrow image for point 6
	pop();

	//reset the value of current brightness
	currentBrightness = ((graph_originY - point2_y) / (graph_originY - graph_maxY)) * 100;
}

function mouseDragged(){
	//dragging on background

	//dragging on point2
	var r = 0.1 * width; //acceptable range for dragging a ball
	if (abs(mouseX - width * point2_x) < r && abs(mouseY - height * point2_y) < r){
		//when your mouse cursor is in the range of the point 2
		console.log("dragging the point 2");

		if(mouseY < graph_originY * height && mouseY > graph_maxY * height){	
			point2_y = mouseY / height;
        	point1_y = point2_y;
    	}
	
	}

	//dragging on point3
	if (abs(mouseX - width * point3_x) < r && abs(mouseY - height * point3_y) < r){
		//when your mouse cursor is in the range of the point 3
		console.log("dragging the point 3");

		if(mouseY < graph_originY * height && mouseY > graph_maxY * height){	
			point3_y = mouseY / height;
        	point4_y = point3_y;
    	}
		
	}

	//dragging on point5
	if (abs(mouseX - width * point5_x) < r && abs(mouseY - height * point5_y) < r){
		//when your mouse cursor is in the range of the point 5
		console.log("dragging the point 5");

		if(mouseX > graph_originX * width && mouseX < point6_x * width - r){	
			point5_x = mouseX / width;
	        point2_x = point5_x;
	    }
		
	}

	//dragging on point6
	if (abs(mouseX - width * point6_x) < r && abs(mouseY - height * point6_y) < r){
		//when your mouse cursor is in the range of the point 6
		console.log("dragging the point 6");

		if(mouseX > point5_x * width + r && mouseX < width){	
			point6_x = mouseX / width;
	        point3_x = point6_x;
	    }
		
	}	
}


function mouseReleased(){
	console.log("mouse is released");

	//dragging point2
	var r = 0.1 * width;
	if (abs(mouseX - width * point2_x) < r && abs(mouseY - height * point2_y) < r){
		console.log("on the point 2 ball");

		//$.post( "/hueapi/changeBri", { brightness : currentBrightness} );

		  $.ajax({
            type: "post",
            url: "/hueapi/changeBri",
            data: { brightness : currentBrightness},
            success: function(data){
              alert(data);
            }
          });
	
	}
}


function windowResized() {
  var graphAreaWidth = $("#graph-area").width();
  var graphAreaHeight = $("#graph-area").height();
  resizeCanvas(graphAreaWidth, graphAreaHeight);
}

