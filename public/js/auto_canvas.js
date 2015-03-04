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


X-axis represents time, and Y-axis represents brightness.
Axis of the time starts at 12:00pm(left edge) and ends at 11:59am(right edge)
The value for time(ex: pt2_time) is in the range of 0 ~ 24. 1 represents 1 hour.
The value for brightness(ex: pt_bri) is in the range of 0 ~ 100.

*/

//=========== global variables ===========
//graph area
var graphAreaWidth, graphAreaHeight; //actual size of graph area

//points
// //var pt2_time = 9,        pt2_bri = 100; //initial values of point 2
// var pt1_time = 0,        pt1_bri = pt2_bri; //initial values of point 1
// //var pt3_time = 12,       pt3_bri = 10; //initial values of point 3
// var pt4_time = 24,       pt4_bri = pt3_bri; //initial values of point 4
// var pt5_time = pt2_time, pt5_bri = 0; //initial values of point 5
// var pt6_time = pt3_time, pt6_bri = 0; //initial values of point 6

var pt2_time, pt2_bri;
var pt1_time, pt1_bri;
var pt3_time, pt3_bri;
var pt4_time, pt4_bri;
var pt5_time, pt5_bri;
var pt6_time, pt6_bri;


// images
var bgImage, arrowImageLR, arrowImageUD; //image data
var bgImageX; //the X position of bg image
var original_ImageWidth   = 6179, original_ImageHeight    = 800; //original size
var original_LeftGap      = 66,   original_RightGap       = 6114; //original gap size
var original_TopGap       = 66,   original_BottomGap      = 696; //original gap size
var original_HalfHourDist = 126,  original_Bri100pcntDist = 126*5; //original distance length btw each dotted line
var actual_BgImageWidth, actual_BgImageHeight; //actual size

//constants for positioning points on the background image
var pm1200startX, am1159endX, graphBottomGap, halfHourDist, bri100pcntDist;

//=========== setup() ===========
function setup() {
	//create a canvas
	graphAreaWidth  = $("#graph-area").width(); //get the width of the parent div
	graphAreaHeight = $("#graph-area").height(); //get the height of the parent div
  	var myCanvas    = createCanvas(graphAreaWidth, graphAreaHeight); //create the canvas with those values

  	//move the canvas inside the div of graph-area
  	myCanvas.id("graph");
  	$("#graph-area").append($("#graph"));
  	$("#graph").removeAttr("style");

  	//set values for points
  	//pt2_time = 9,        pt2_bri = 100; //initial values of point 2
	pt1_time = 0,        pt1_bri = pt2_bri; //initial values of point 1
	//pt3_time = 12,       pt3_bri = 10; //initial values of point 3
	pt4_time = 24,       pt4_bri = pt3_bri; //initial values of point 4
	pt5_time = pt2_time, pt5_bri = 0; //initial values of point 5
	pt6_time = pt3_time, pt6_bri = 0; //initial values of point 6

  	//load images
	bgImage      = loadImage("../img/graph.png");
	arrowImageLR = loadImage("../img/arrow_left_right.png");
    arrowImageUD = loadImage("../img/arrow_up.png");

    //change color mode
    colorMode(HSB, 359, 100, 100, 100);

    //set constant values
    actual_BgImageHeight = graphAreaHeight;
    var compressedRate   = actual_BgImageHeight / original_ImageHeight;
    actual_BgImageWidth  = original_ImageWidth     * compressedRate;
    pm1200startX         = original_LeftGap        * compressedRate;
    am1159endX           = original_RightGap       * compressedRate;
    graphBottomGap       = original_BottomGap      * compressedRate;
    halfHourDist         = original_HalfHourDist   * compressedRate;
    bri100pcntDist       = original_Bri100pcntDist * compressedRate;

    //set initial x position of bg image
    bgImageX = -getXonBg(currentTime - 1);

}

//=========== draw() ===========
function draw() {
	setBackgroundImage();
	fillTheGraph();
	drawLines();
	displayLabels();
	setArrowImages();
	updateValues();
}

//=========== setBackgroundImage() ===========
//set the background image
function setBackgroundImage(){
	if(bgImageX > 0){
		//fix the bgImage position if it is out of range
		bgImageX = 0;
	} else if(bgImageX < graphAreaWidth - actual_BgImageWidth){
		//fix the bgImage position if it is out of range
		bgImageX = graphAreaWidth - actual_BgImageWidth;	
	}
	push();
	translate(bgImageX, 0);
	image(bgImage, 0, 0, actual_BgImageWidth, actual_BgImageHeight); //set bg image
	pop();
}

//=========== fillTheGraph() ===========
//fill the graph with the selected color
function fillTheGraph(){
	push();
	translate(bgImageX, 0);

	noStroke();
	fill(selectedColorValue.h, selectedColorValue.s, selectedColorValue.v, 60); //"selectedColorValue" instance is passed from html
	rect(getXonBg(pt1_time), getYonBg(pt1_bri), getXonBg(pt2_time) - getXonBg(pt1_time), getYonBg(0) - getYonBg(pt1_bri)); //rectangle at the left side
	rect(getXonBg(pt3_time), getYonBg(pt3_bri), getXonBg(pt4_time) - getXonBg(pt3_time), getYonBg(0) - getYonBg(pt3_bri)); //triangle at the top

	if(pt2_bri > pt3_bri){
		//when point2 is greater than point3
		rect(getXonBg(pt2_time), getYonBg(pt3_bri), getXonBg(pt3_time) - getXonBg(pt2_time), getYonBg(0) - getYonBg(pt3_bri)); //rectangle at the bottom
		triangle(getXonBg(pt2_time), getYonBg(pt2_bri), getXonBg(pt3_time), getYonBg(pt3_bri), getXonBg(pt2_time), getYonBg(pt3_bri)); //triangle at the top
	} else {
		//when point2 is smaller than point3
		rect(getXonBg(pt2_time), getYonBg(pt2_bri), getXonBg(pt3_time) - getXonBg(pt2_time), getYonBg(0) - getYonBg(pt2_bri)); //rectangle at the bottom
		triangle(getXonBg(pt2_time), getYonBg(pt2_bri), getXonBg(pt3_time), getYonBg(pt3_bri), getXonBg(pt3_time), getYonBg(pt2_bri)); //triangle at the top
	}

	pop();
}

//=========== drawLines() ===========
function drawLines(){
	fill(40);

	push();
	translate(bgImageX, 0);

	//draw current time bar
	stroke(0, 60, 100);
	line(getXonBg(currentTime), getYonBg(102), getXonBg(currentTime), getYonBg(0));

	//draw vertical lines
	stroke(40);
	line(getXonBg(pt2_time), getYonBg(pt2_bri), getXonBg(pt5_time), getYonBg(pt5_bri));
	line(getXonBg(pt3_time), getYonBg(pt3_bri), getXonBg(pt6_time), getYonBg(pt6_bri));
	
	pop();

	//draw axis
	stroke(40);
	line(0.08*width, getYonCv(102), 0.08*width, getYonCv(0)); //Y-axis
	line(0.08*width, getYonCv(0), width, getYonCv(0)); //X-axis
}

//=========== displayLabels() ===========
function displayLabels(){
	//display labels for Y-axis
	fill(40);
	stroke(40);
	strokeWeight(0.1);
	textSize(0.04*height);
	text("brightness", 0.02*width, getYonCv(105));
	textSize(0.02*height);
	text("100", 0.02*width, getYonCv(95));
	text(" 80", 0.02*width, getYonCv(75));
	text(" 60", 0.02*width, getYonCv(55));
	text(" 40", 0.02*width, getYonCv(35));
	text(" 20", 0.02*width, getYonCv(15));
}

//=========== setArrowImages() ===========
function setArrowImages(){
	push();
	translate(bgImageX, 0);

	//draw up & down arrow images
	push();
	translate(-arrowImageUD.width/4, arrowImageUD.height/4 - 0.015*height); //adjust the position
	image(arrowImageUD, getXonBg(pt2_time), getYonBg(pt2_bri), arrowImageUD.width/2, -arrowImageUD.height/2);//arrow image for point 2
	image(arrowImageUD, getXonBg(pt3_time), getYonBg(pt3_bri), arrowImageUD.width/2, -arrowImageUD.height/2);//arrow image for point 3
	pop();

	//draw left & right arrow images
	push();
	translate(-arrowImageLR.width/4, arrowImageLR.height/4);//adjust the position
	image(arrowImageLR, getXonBg(pt5_time), getYonBg(0), arrowImageLR.width/2, -arrowImageLR.height/2);//arrow image for point 5	
	image(arrowImageLR, getXonBg(pt6_time), getYonBg(0), arrowImageLR.width/2, -arrowImageLR.height/2);//arrow image for point 6
	pop();

	pop();
}

//=========== updateValues() ===========
function updateValues(){

}


//=========== mouseDragged() ===========
//when you drag your mouse on the canvas
function mouseDragged(){
	var r = getXonBg(0.25); //acceptable range for dragging a point

	//dragging on point2 --------------------
	//when your mouse cursor is in the range of the point 2
	if (dist(mouseX, mouseY, getXonCv(pt2_time), getYonCv(pt2_bri)) < r){
		//change the position of the point only when its within the graph
		if(mouseY < getYonCv(0) && mouseY > getYonCv(100)){
			pt2_bri = getBri(mouseY);
        	pt1_bri = pt2_bri;
        	console.log("pt2_bri is moved to: " + pt2_bri);
    	}
	}
	//dragging on point3 --------------------
	//when your mouse cursor is in the range of the point 3
	else if (dist(mouseX, mouseY, getXonCv(pt3_time), getYonCv(pt3_bri)) < r){
		//change the position of the point only when its within the graph
		if(mouseY < getYonCv(0) && mouseY >getYonCv(100)){	
			pt3_bri = getBri(mouseY);
        	pt4_bri = pt3_bri;
        	console.log("pt3_bri is moved to: " + pt3_bri);
    	}
	}
	//dragging on point5 --------------------
	//when your mouse cursor is in the range of the point 5
	else if (dist(mouseX, mouseY, getXonCv(pt5_time), getYonCv(pt5_bri)) < r){
		//change the position of the point only when its within the graph
		if(getTime(mouseX) > 0 && mouseX < getXonCv(pt6_time) - r){	
			pt5_time = getTime(mouseX);
	        pt2_time = pt5_time;
	        console.log("pt5_time is moved to: " + pt5_time);
	    }
	}
	//dragging on point6 --------------------
	//when your mouse cursor is in the range of the point 6
	else if (dist(mouseX, mouseY, getXonCv(pt6_time), getYonCv(pt6_bri)) < r){
		//change the position of the point only when its within the graph
		if(mouseX > getXonCv(pt5_time) + r && getTime(mouseX) < 24){	
			pt6_time = getTime(mouseX);
	        pt3_time = pt6_time;
	        console.log("pt6_time is moved to: " + pt6_time);
	    }
	}
	//dragging on background --------------------
	//when your mouse cursor is on the bg image, not on any points
	else if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
		//scroll the graph
		scrollTheGraph();
	}
}

//=========== scrollTheGraph() ===========
//scroll the graph
function scrollTheGraph(){
	//if bg image is set within valid area
	if(bgImageX <= 0 && bgImageX >= graphAreaWidth - actual_BgImageWidth){
		//update the position of back ground image
		var delta = mouseX - pmouseX;
		bgImageX += delta;

		console.log("bgImageX is relocated at: " + bgImageX);
	} 
}

//=========== mouseReleased() ===========
//when you relase your clicked mouse on the canvas
function mouseReleased(){
	var r = getXonBg(0.25); //acceptable range for dragging a point

	//dragging on points --------------------
	//when your mouse cursor is in the range of the point 2, 3, 5, or 6
	if ((dist(mouseX, mouseY, getXonCv(pt2_time), getYonCv(pt2_bri)) < r) ||
		(dist(mouseX, mouseY, getXonCv(pt3_time), getYonCv(pt3_bri)) < r) ||
		(dist(mouseX, mouseY, getXonCv(pt5_time), getYonCv(pt5_bri)) < r) ||
		(dist(mouseX, mouseY, getXonCv(pt6_time), getYonCv(pt6_bri)) < r)){

		//update the light status
        updateLightStatus();

        //update the current time
        currentTime = getCurrentTime();

        //remove active class from buttons on the middle bar
        $("#middle-button-full").removeClass("active");
    	$("#middle-button-off").removeClass("active");
	}
}

//=========== windowResized() ===========
//when the browser window is resized
function windowResized() {
	//resize the canvas size
	graphAreaWidth  = $("#graph-area").width();//get the width of the parent div
	graphAreaHeight = $("#graph-area").height();//get the height of the parent div
	resizeCanvas(graphAreaWidth, graphAreaHeight);

	//update constant values
	actual_BgImageHeight = graphAreaHeight;
	var compressedRate   = actual_BgImageHeight / original_ImageHeight;
	actual_BgImageWidth  = original_ImageWidth     * compressedRate;
 	pm1200startX         = original_LeftGap        * compressedRate;
	am1159endX           = original_RightGap       * compressedRate;
	graphBottomGap       = original_BottomGap      * compressedRate;
	halfHourDist         = original_HalfHourDist   * compressedRate;
	bri100pcntDist       = original_Bri100pcntDist * compressedRate;
}

//=========== keyPressed() ===========    //for debugging use
//when a key is pressed
function keyPressed() {
	if(keyCode == UP_ARROW){
		currentTime += 0.1;
		//calc current brightness
		currentBrightness = getCurrentBri(currentTime, pt2_time, pt2_bri, pt3_time, pt3_bri);
		//change the light status
    	changeLightStatusTemp("manual", currentBrightness, selectedColorId);

    	$("#middle-button-full").removeClass("active");
    	$("#middle-button-off").removeClass("active");

	} else if (keyCode == DOWN_ARROW){
		currentTime -= 0.1;
		//calc current brightness
		currentBrightness = getCurrentBri(currentTime, pt2_time, pt2_bri, pt3_time, pt3_bri);
		//change the light status
    	changeLightStatusTemp("manual", currentBrightness, selectedColorId);

    	$("#middle-button-full").removeClass("active");
    	$("#middle-button-off").removeClass("active");
	}
}


/*=======================  basic functions  =======================*/
//=========== getXonBg() ===========
//returns the X position on the background image   //origin is (pm1200startX, graphBottomGap)
function getXonBg(_time){
	return  pm1200startX + _time*halfHourDist*2;
}

//=========== getXonCv() ===========
//returns the X position on the canvas   //origin is (0, 0)
function getXonCv(_time){
	return getXonBg(_time) + bgImageX;
}

//=========== getYonBg() ===========
//returns the Y position on the background image   //origin is (pm1200startX, graphBottomGap)
function getYonBg(_bri){
	return graphBottomGap - (_bri/100)*bri100pcntDist;
}

//=========== getYonCv() ===========
//returns the Y position on the canvas   //origin is (0, 0)
function getYonCv(_bri){
	return getYonBg(_bri);
}

//=========== getTime() ===========
//returns time value according to X position on the canvas
function getTime(_xOnCv){
	return (_xOnCv - pm1200startX - bgImageX) / (halfHourDist*2);
}

//=========== getBri() ===========
//returns brightness value according to Y position on the canvas
function getBri(_yOnCv){
	return (graphBottomGap - _yOnCv) / bri100pcntDist * 100
}
