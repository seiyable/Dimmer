//=========== global variables ===========
var axis_originX = 0.05;
var axis_originY = 0.90;
var axis_topY = 0.05;
var maxY = 0.1;

var point2_x = 0.2, point2_y = maxY;
var point1_x = axis_originX, point1_y = point2_y;
var point3_x = 0.8, point3_y = 0.8;
var point4_x = 1.0, point4_y = point3_y;
var point5_x = point2_x, point5_y = axis_originY;
var point6_x = point3_x, point6_y = axis_originY;

var timeLineX = 0.5;


// images
var arrow_left_right;
var arrow_up_down;

//=========== setup() ===========
function setup() {
	//create a canvas
	var graphAreaWidth = $("#graph-area").width();
	var graphAreaHeight = $("#graph-area").height();
	console.log("height: " + graphAreaHeight);
	console.log("width: " + graphAreaWidth);
  	var myCanvas = createCanvas(graphAreaWidth, graphAreaHeight);
  	console.log("canvas height: " + height);
  	console.log("canvas width: " + width);


  	//move the canvas inside the div of graph-area
  	myCanvas.id("graph");
  	$("#graph-area").append($("#graph"));
  	$("#graph").removeAttr("style");

	backImage = loadImage("../img/graph_bg.png");
	arrow_left_right=loadImage("../img/arrow_left_right.png");
    arrow_up_down = loadImage("../img/arrow_up.png");

}

//=========== draw() ===========
function draw() {
	var graphAreaWidth = $("#graph-area").width();
	var graphAreaHeight = $("#graph-area").height();

	//image for background
	image(backImage, 0, 0, graphAreaWidth, graphAreaHeight);


	//fill for the graph
	noStroke();
	fill(colorSelected.r, colorSelected.g, colorSelected.b, 150);
	rect(point1_x * width, point1_y * height, (point2_x - point1_x) * width, (axis_originY - point1_y) * height);
	rect(point3_x * width, point3_y * height, (width - point3_x) * width, (axis_originY - point3_y) * height);

	if(point2_y < point3_y){
		//normal
		rect(point2_x * width, point3_y * height, (point3_x - point2_x) * width, (axis_originY - point3_y) * height);
		triangle(point2_x * width, point2_y * height, point3_x * width, point3_y * height, point2_x * width, point3_y * height);
	} else {
		//abnormal
		rect(point2_x * width, point2_y * height, (point3_x - point2_x) * width, (axis_originY - point2_y) * height);
		triangle(point2_x * width, point2_y * height, point3_x * width, point3_y * height, point3_x * width, point2_y * height);
	}
	stroke(1);

	//current time bar
	line(width * timeLineX, height * maxY, width * timeLineX, height * axis_originY);

	//axis
	line(width * axis_originX, height * axis_topY, width * axis_originX, height * axis_originY);
	line(width * axis_originX, height * axis_originY, width, height * axis_originY);

	//vertical lines
	line(width * point2_x, height * point2_y, width * point5_x, height * point5_y);
	line(width * point3_x, height * point3_y, width * point6_x, height * point6_y);

	//draw arrows
	push();
	translate(-arrow_up_down.width/4, -arrow_up_down.height/4 - 0.02*height);
	//arrow image for point 2
	image(arrow_up_down, width * point2_x, height * point2_y, arrow_up_down.width/2, arrow_up_down.height/2);
	
	//arrow image for point 3
	image(arrow_up_down, width * point3_x, height * point3_y, arrow_up_down.width/2, arrow_up_down.height/2);
	pop();

	push();
	translate(-arrow_left_right.width/4, -arrow_left_right.height/4);
	//arrow image for point 5
	image(arrow_left_right, width*point5_x, height * axis_originY, arrow_left_right.width/2,arrow_left_right.height/2);
	
	//arrow image for point 6
	image(arrow_left_right, width*point6_x, height * axis_originY, arrow_left_right.width/2, arrow_left_right.height/2);
	pop();

	//graph
	// line(width * point1_x, height * point1_y, width * point2_x, height * point2_y);
	// line(width * point2_x, height * point2_y, width * point3_x, height * point3_y);
	// line(width * point3_x, height * point3_y, width * point4_x, height * point4_y);
}

function mouseDragged(){
	console.log("mouse is dragged");

	//dragging point2
	var r = 0.1 * width;
	if (abs(mouseX - width * point2_x) < r && abs(mouseY - height * point2_y) < r){
		console.log("on the point 2 ball");

		if(mouseY < axis_originY * height && mouseY > maxY * height){	
			point2_y = mouseY / height;
        	point1_y = point2_y;
    	}
	
	}

	//dragging point3
	if (abs(mouseX - width * point3_x) < r && abs(mouseY - height * point3_y) < r){
		console.log("on the point 3 ball");

		if(mouseY < axis_originY * height && mouseY > maxY * height){	
			point3_y = mouseY / height;
        	point4_y = point3_y;
    	}
		
	}

	//dragging point5
	if (abs(mouseX - width * point5_x) < r && abs(mouseY - height * point5_y) < r){
		console.log("on the point 5 ball");

		if(mouseX > axis_originX * width && mouseX < point6_x * width - r){	
			point5_x = mouseX / width;
	        point2_x = point5_x;
	    }
		
	}

	//dragging point6
	if (abs(mouseX - width * point6_x) < r && abs(mouseY - height * point6_y) < r){
		console.log("on the point 6 ball");

		if(mouseX > point5_x * width + r && mouseX < width){	
			point6_x = mouseX / width;
	        point3_x = point6_x;
	    }
		
	}

	
	
}

function windowResized() {
  var graphAreaWidth = $("#graph-area").width();
  var graphAreaHeight = $("#graph-area").height();
  resizeCanvas(graphAreaWidth, graphAreaHeight);
}

