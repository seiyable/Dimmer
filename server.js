//server program for the first hue app
//authors: Seiya Kobayashi
//last updated: 2/24/2015
//version: 0.1

//================================================
//require
var express = require('express');
var exphbs  = require('express3-handlebars');
var app = express();
var bodyParser = require('body-parser');
var hue = require("node-hue-api");
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://seiyable:Ketta5884@dbh29.mongolab.com:27297/toilet_champ";

//use static local files
app.use(express.static(__dirname + '/public'));
//handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//body parser
app.use(bodyParser());

//================================================
//hue settings
var HueApi = hue.HueApi;
var lightState = hue.lightState;

var displayResult = function(result) {
    //console.log(result);
    console.log(JSON.stringify(result, null, 2));
};

var displayError = function(err) {
    console.log(JSON.stringify(status, null, 2));};

var displayStatus = function(status) {
    console.log(JSON.stringify(status, null, 2));
};

//var hostname = "128.122.151.166"; //itp
var hostname = "192.168.2.13"; //seiya's local hue bridge
//var username = "matanseiya"; //itp
var username = "seiyakobayashi"; //seiya's local hue bridge
var api = new HueApi(hostname, username);
//var lightId = 5; //itp
var lightId = 4; //seiya's local hue bridge


//var state = lightState.create();

// --------------------------
//display bridge config
//api.config().then(displayResult).done();

//list all the lights connected to the bridge
// api.lights()
//     .then(displayResult)
//     .done();

/*
// Set light state to 'on' with warm white value of 500 and brightness set to 100%
state.on().white(200, 50);
api.setLightState(5, state)
    .then(displayResult)
    .done();
*/

//--------


// // Set the lamp with id '5' to on
// api.setLightState(5, state.on())
//     .then(displayResult)
//     .fail(displayError)
//     .done();


// // Set the lamp with id '5' to off
// api.setLightState(5, state.off())
//     .then(displayResult)
//     .fail(displayError)
//     .done();

//check the light status
// api.lightStatus(5)
// .then(displayStatus)
// .done();

//name the light
// api.setLightName(5, "MaTanSeiya")
//     .then(displayResult)
//     .done();

//change the color
// state.hsl(0, 100, 40);

// api.setLightState(5, state)
//     .then(displayResult)
//     .done();
//================================================




//response to the GET request for the AUTO page
app.get('/auto', function(req, res){
  var data = {};

  res.render('layouts/auto', data);
});

//response to the GET request for the MANUAL page
app.get('/manual', function(req, res){
  var data = {};

  res.render('layouts/manual', data);
});

//response to the GET request for the ADD COLOR page
app.get('/addColor', function(req, res){
  var data = {};

  res.render('layouts/addColor', data);
});


//response to the POST request to change color
app.post('/hueapi/changeColor', function(req, res){
  var state = lightState.create();
 
  // Set light state to 'on' first
  api.setLightState(lightId, state.on())
    .then(displayResult)
    .done();

  //if the request has data named "selectedColorId"
  if (req.body.selectedColorId){
    var id = req.body.selectedColorId;
    if(id == "white-button"){
      state.hsl(24000/182, 0/2.55, 255/2.55);
      console.log("turn white");

    } else if(id == "yellow-button"){
      state.hsl(17000/182, 180/2.55, 255/2.55);
      console.log("turn yellow");

    }  else if(id == "orange-button"){
      state.hsl(8000/182, 255/2.55, 255/2.55);
      console.log("turn orange");

    }  else if(id == "pink-button"){
      state.hsl(28/182, 129/2.55, 255/2.55);
      console.log("turn pink");

    }  else if(id == "red-button"){
      state.hsl(1000/182, 190/2.55, 255/2.55);
      console.log("turn red");

    }  else if(id == "turquoise-button"){
      state.hsl(42000/182, 255/2.55, 255/2.55);
      console.log("turn turquoise");

    }  else if(id == "blue-button"){
      state.hsl(45000/182, 255/2.55, 255/2.55);
      console.log("turn blue");

    }  else if(id == "green-button"){
      state.hsl(28000/182, 200/2.55, 255/2.55);
      console.log("turn green");

    }  else if(id == "purple-button"){
      state.hsl(49000/182, 255/2.55, 255/2.55);
      console.log("turn purple");

    }
  }

  //set the brightness
  if(req.body.brightness){
     state.bri(req.body.brightness);
  }

  //change the color
   api.setLightState(lightId, state)
     .then(displayResult)
     .done();

  res.end();

});

//response to the POST request to turn on or off the light
app.post('/hueapi/turnOnOff', function(req, res){
  var state = lightState.create();

  if (req.body.state){
    if(req.body.state == "on"){
      // Set light state to 'on' with warm white value of 500 and brightness set to 100%
      state.on().white(255, 255);
      api.setLightState(lightId, state)
        .then(displayResult)
        .done();
      } else if(req.body.state == "off"){
        // Set light state to 'on' with warm white value of 500 and brightness set to 100%
        state.off();
        api.setLightState(lightId, state)
          .then(displayResult)
          .done();
      }
  }

  res.end();
});

//response to the POST request to turn on or off the light
app.post('/hueapi/changeBri', function(req, res){
  var state = lightState.create();

  // Set light state to 'on' first
  api.setLightState(lightId, state.on())
    .then(displayResult)
    .done();

  if (req.body.brightness){
      // Set the brightness with the given value
      state.bri(req.body.brightness);
      api.setLightState(lightId, state)
        .then(displayResult)
        .done();
  }

  res.end();
});

//============================================
//server setup
var server = app.listen(8080, function(){
  console.log('Listening on port %d', server.address().port);
});