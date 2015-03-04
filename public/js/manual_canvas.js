//=========== global variables ===========
//graph area
var manual_graphAreaWidth, manual_graphAreaHeight; //actual size of graph area

// images
var manual_bgImage;
var manual_original_ImageWidth   = 2000, manual_original_ImageHeight    = 800; //original size
var manual_actual_BgImageWidth, manual_actual_BgImageHeight; //actual size

var slider_baseImage;
var slider_base_original_ImageWidth = 909, slider_base_original_ImageHeight = 73;
var slider_base_actual_ImageWidth, slider_base_actual_ImageHeight;

var slider_yellowImage;
var slider_yellow_original_ImageWidth = 356, slider_yellow_original_ImageHeight = 73;
var slider_yellow_actual_ImageWidth, slider_yellow_actual_ImageHeight;

var slider_yellowImage_left, slider_yellowImage_right;
var slider_yellow_lr_original_ImageWidth = 12;
var slider_yellow_lr_actual_ImageWidth;

//=========== setup() ===========
function setup() {
	//create a canvas
	manual_graphAreaWidth  = $("#manual-brightness-area").width(); //get the width of the parent div
	manual_graphAreaHeight = $("#manual-brightness-area").height(); //get the height of the parent div
  	var myCanvas = createCanvas(manual_graphAreaWidth, manual_graphAreaHeight);

  	//move the canvas inside the div of graph-area
  	myCanvas.id("manual-brightness");
  	$("#manual-brightness-area").append($("#manual-brightness"));
  	$("#manual-brightness").removeAttr("style");

  	//load images
  	manual_bgImage           = loadImage("../img/manual_bg.png");
  	slider_baseImage         = loadImage("../img/brightness_bar_bg.png");
  	slider_yellowImage       = loadImage("../img/brightness_bar.png");
  	slider_yellowImage_left  = loadImage("../img/brightness_bar_left_edge.png");
  	slider_yellowImage_right = loadImage("../img/brightness_bar_right_edge.png");

  	//change color mode
    colorMode(HSB, 359, 100, 100, 100);

    //set constant values
    manual_actual_BgImageHeight        = manual_graphAreaHeight;
    var compressedRate                 = manual_actual_BgImageHeight / manual_original_ImageHeight;
    manual_actual_BgImageWidth         = manual_original_ImageWidth           * compressedRate;
    slider_base_actual_ImageWidth      = slider_base_original_ImageWidth      * compressedRate;
    slider_base_actual_ImageHeight     = slider_base_original_ImageHeight     * compressedRate;
    slider_yellow_actual_ImageWidth    = slider_yellow_original_ImageWidth    * compressedRate;
    slider_yellow_actual_ImageHeight   = slider_yellow_original_ImageHeight   * compressedRate;
    slider_yellow_lr_actual_ImageWidth = slider_yellow_lr_original_ImageWidth * compressedRate;
}

//=========== draw() ===========
function draw() {
	setBackgroundImage();
	displayLabels();
	displaySlider();
	updateValues();
}

//=========== setBackgroundImage() ===========
//set the background image
function setBackgroundImage(){
	image(manual_bgImage, 0, 0, manual_actual_BgImageWidth, manual_graphAreaHeight); //set bg image
}

//=========== displayLabels() ===========
function displayLabels(){
	var slider_posX = (width  - slider_base_actual_ImageWidth)  / 2;
	var slider_posY = (height - slider_base_actual_ImageHeight) / 2;

	fill(40);
	stroke(40);
	strokeWeight(0.1);
	textSize(0.05*height);
	
	text("brightness: " + parseInt(currentBrightness), slider_posX, slider_posY - 0.07*height);

}

//=========== displaySlider() ===========
//display the slider for brightness
function displaySlider(){
	var slider_posX = (width  - slider_base_actual_ImageWidth)  / 2;
	var slider_posY = (height - slider_base_actual_ImageHeight) / 2;

	//base image
	image(slider_baseImage, slider_posX, slider_posY, slider_base_actual_ImageWidth, slider_base_actual_ImageHeight);

	//left edge of the yellow bar
	image(slider_yellowImage_left, slider_posX, slider_posY, slider_yellow_lr_actual_ImageWidth, slider_yellow_actual_ImageHeight);

	//middle part of the yellow bar
	noStroke();
	fill(47, 62, 100);
	rect(slider_posX + slider_yellow_lr_actual_ImageWidth, slider_posY, getBarWidth(currentBrightness) + 1, slider_yellow_actual_ImageHeight);
	stroke(0);

	//right edge of the yellow bar
	image(slider_yellowImage_right, slider_posX + slider_yellow_lr_actual_ImageWidth + getBarWidth(currentBrightness), slider_posY, slider_yellow_lr_actual_ImageWidth, slider_yellow_actual_ImageHeight);
}

//=========== updateValues() ===========
function updateValues(){
	//update the value of current brightness
	if(currentBrightness < 0){
		currentBrightness = 0;
	} else if (currentBrightness > 100){
		currentBrightness = 100;
	}
}

//=========== mouseDragged() ===========
//when you drag your mouse on the canvas
function mouseDragged(){

	var slider_left_edge    = (width  - slider_base_actual_ImageWidth)  / 2;
	var slider_right_edge   = slider_left_edge + (slider_yellow_lr_actual_ImageWidth * 2) + getBarWidth(currentBrightness);
	var slider_top_edge     = (height - slider_base_actual_ImageHeight) / 2;
	var slider_bottom_edge  = slider_top_edge + slider_base_actual_ImageHeight;
	var margin              = slider_base_actual_ImageWidth / 10;

	//if your mouse is on the yellow bar
	if(mouseX > slider_left_edge - margin && mouseX < slider_right_edge + margin && mouseY > slider_top_edge && mouseY < slider_bottom_edge){
		//if the bar is in the right range
		if(getBri(mouseX) >= 0 && getBri(mouseX) <= 101){
			//update brightness value
			currentBrightness = getBri(mouseX);
			console.log(currentBrightness);
		}
	}
}

//=========== mouseReleased() ===========
//when you relase your clicked mouse on the canvas
function mouseReleased(){

	var slider_left_edge    = (width  - slider_base_actual_ImageWidth)  / 2;
	var slider_right_edge   = slider_left_edge + (slider_yellow_lr_actual_ImageWidth * 2) + getBarWidth(currentBrightness);
	var slider_top_edge     = (height - slider_base_actual_ImageHeight) / 2;
	var slider_bottom_edge  = slider_top_edge + slider_base_actual_ImageHeight;
	var margin              = slider_base_actual_ImageWidth / 10;

	//if your mouse is on the yellow bar
	if(mouseX > slider_left_edge - margin && mouseX < slider_right_edge + margin && mouseY > slider_top_edge && mouseY < slider_bottom_edge){
		//if the bar is in the right range
		if(getBri(mouseX) >= 0 && getBri(mouseX) <= 101){
			//change the brightness of the light
			changeLightStatusTemp("manual", currentBrightness, selectedColorId);

			$("#manual-middle-button-full").removeClass("active");
    		$("#manual-middle-button-off").removeClass("active");
    	}
    }

}

//=========== windowResized() ===========
//when the browser window is resized
function windowResized() {
	//resize the canvas size
	manual_graphAreaWidth  = $("#manual-brightness-area").width(); //get the width of the parent div
	manual_graphAreaHeight = $("#manual-brightness-area").height(); //get the height of the parent div
  	resizeCanvas(manual_graphAreaWidth, manual_graphAreaHeight);

	//update constant values
    manual_actual_BgImageHeight        = manual_graphAreaHeight;
    var compressedRate                 = manual_actual_BgImageHeight / manual_original_ImageHeight;
    manual_actual_BgImageWidth         = manual_original_ImageWidth           * compressedRate;
    slider_base_actual_ImageWidth      = slider_base_original_ImageWidth      * compressedRate;
    slider_base_actual_ImageHeight     = slider_base_original_ImageHeight     * compressedRate;
    slider_yellow_actual_ImageWidth    = slider_yellow_original_ImageWidth    * compressedRate;
    slider_yellow_actual_ImageHeight   = slider_yellow_original_ImageHeight   * compressedRate;
    slider_yellow_lr_actual_ImageWidth = slider_yellow_lr_original_ImageWidth * compressedRate;
}


/*=======================  basic functions  =======================*/
//=========== getBarWidth() ===========
//return width of the middle part of the yellow bar to the given brightness
function getBarWidth(_bri){
	var b = slider_base_actual_ImageWidth;
	var y = slider_yellow_lr_actual_ImageWidth;
	return (_bri/100) * (b - y*2); //considering images at both edges
}

//=========== getBri() ===========
//return brightness to the given mouse position
function getBri(_mouseX){
	var b = slider_base_actual_ImageWidth;
	var y = slider_yellow_lr_actual_ImageWidth;
	return (_mouseX*2 - y*4 - (width - b)) / (b*2 - y*4)*100;
}
