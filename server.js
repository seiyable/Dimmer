//server program for the first hue app
//authors: Seiya Kobayashi
//last updated: 3/1/2015
//version: 0.4

//================================================
//require
//================================================
var express    = require('express');
var exphbs     = require('express3-handlebars');
var bodyParser = require('body-parser');
var hue        = require("node-hue-api");
var mongodb    = require('mongodb');

//================================================
//express settings
//================================================

var app = express();

//use static local files
app.use(express.static(__dirname + '/public'));
//handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//body parser
app.use(bodyParser());


//================================================
//hue settings
//================================================

var HueApi = hue.HueApi;
var lightState = hue.lightState;

//display result
var displayResult = function(result) {
    console.log("Response from hue bridge: " + JSON.stringify(result, null, 2));
};

//display error
var displayError = function(err) {
    console.log("Response from hue bridge: " + JSON.stringify(status, null, 2));
};

//display status
var displayStatus = function(status) {
    console.log("Response from hue bridge: " + JSON.stringify(status, null, 2));
};

//var hostname = "128.122.151.166"; //itp
//var username = "matanseiya"; //itp
//var lightId = 5; //itp
//var hostname = "192.168.2.5"; //seiya's local hue bridge
//var username = "seiyakobayashi"; //seiya's local hue bridge
//var lightId = 4; //seiya's local hue bridge

//var api = new HueApi(hostname, username);

// --------------------------
//var state = lightState.create();

//display bridge config
//api.config().then(displayResult).done();

//list all the lights connected to the bridge
// api.lights()
//     .then(displayResult)
//     .done();

// --------------------------

//================================================
//mongo settings
//================================================

var MONGO_URL = "mongodb://seiyable:Ketta5884@ds049181.mongolab.com:49181/lightdimmer";
var MongoClient = mongodb.MongoClient;
var db; //for mongo database

//================================================
//in-server functions
//================================================

//----------------------------------------
//switch the polling status of the given user id
function switchPolling(_user_id, _bool){

  var user_table = db.collection("user_table");
  user_table
    .update(
      {user_id : _user_id}, //if there is a document that has this user_id,
      {$set: 
        {
          polling_status : _bool //change the value of polling_status
        } 
      }, 
      function(err, result){
        if(err){
          //if there is an error
          console.log('There was an error' + err);
        } else {
          console.log("Polling_status has been turned " + _bool );
        }
      });
}






//----------------------------------------
//convert timestamp to current time
function convertCurrentTime(_timestamp){
  //note: 0pm = 0, 6pm = 6, 0am = 12, 6am = 18
  var date = new Date(_timestamp);
  var hour = date.getHours(), minute = date.getMinutes();
  var currentTime = (hour-12) + minute/60;
  if(currentTime < 0){
    currentTime = 24 - currentTime;
  }

  return currentTime;
}

//----------------------------------------
//calc current brightness 
function getCurrentBri(_currentTime, _pt2_time, _pt2_bri, _pt3_time, _pt3_bri){
  if(_currentTime <= _pt2_time){
    // if current time is before pt2 time
    return _pt2_bri;

  } else if(_currentTime > _pt2_time && _currentTime < _pt3_time) {
    //if current time is between pt2 time and pt3 time
    var slope = (_pt3_bri - _pt2_bri) / (_pt3_time - _pt2_time);
    var intercept = _pt2_bri - slope * _pt2_time;
    return slope * _currentTime + intercept;

  } else if(_currentTime >= _pt3_time) {
    //if current tiem is after pt3 time
    return _pt3_bri

  }
}


/*
//----------------------------------------
//get schedule document
function getSchedule(_user_id, callback){
  var schedule_table = db.collection("schedule_table");
  schedule_table
    .find({user_id : _user_id}) //find all the documents that has this user_id
    .sort({timestamp : -1}) //sort it based on its timestamp in discending order
    .limit(1) //get only the first document
    .toArray(function(err, items){
      if(err){
        //if there is an error
        console.log('There was an error' + err);

      } else {
        //if there is no error
        console.log("Data successfully retrieved for " + _user_id + " as below: " + JSON.stringify(items));

        return the document with callback
      }
  });
}
*/


//----------------------------------------
//change light color and brightness
function changeLightColBri(_user_id, _color_id, _bri){

  //get the ipaddress, username and lightname of the given user
  var user_table = db.collection("user_table");
  user_table
    .find({user_id : _user_id}) //find all the documents that has this user_id
    .sort({timestamp : -1}) //sort it based on its timestamp in discending order
    .limit(1) //get only the first document
    .toArray(function(err, items){
      if(err){
        //if there is an error
        console.log('There was an error' + err);

      } else {
        //if there is no error
        console.log("User data successfully retrieved for " + _user_id + " as bellow: ");
        console.log(JSON.stringify(items));

        //create new hue api with the bridge's ip adress and username registered on it
        var api = new HueApi(items[0].bridge_ip, items[0].bridge_username);

        //state to be passed to hue api
        var state = lightState.create(); 

        // turn the light on first
        api.setLightState(items[0].light_id, state.on())
          .then(displayResult)
          .done();

        // set light color with the given color id
        if(_color_id == "white-button"){                 // white
          state.hsl(24000/182, 0/2.55, _bri);
          console.log("turn white");

        } else if(_color_id == "yellow-button"){         // yellow
          state.hsl(17000/182, 180/2.55, _bri);
          console.log("turn yellow");

        } else if(_color_id == "orange-button"){         // orange
          state.hsl(8000/182, 255/2.55, _bri);
          console.log("turn orange");

        } else if(_color_id == "pink-button"){           // pink
          state.hsl(28/182, 129/2.55, _bri);
          console.log("turn pink");

        } else if(_color_id == "red-button"){            // red
          state.hsl(1000/182, 190/2.55, _bri);
          console.log("turn red");

        } else if(_color_id == "turquoise-button"){      // turquoise
          state.hsl(42000/182, 255/2.55, _bri);
          console.log("turn turquoise");

        } else if(_color_id == "blue-button"){           // blue
          state.hsl(45000/182, 255/2.55, _bri);
          console.log("turn blue");

        } else if(_color_id == "green-button"){          // green
          state.hsl(28000/182, 200/2.55, _bri);
          console.log("turn green");

        } else if(_color_id == "purple-button"){         // purple
          state.hsl(49000/182, 255/2.55, _bri);
          console.log("turn purple");

        } else {
          console.log("the color_id was invalid.")
        }

        //change the color
         api.setLightState(items[0].light_id, state)
           .then(displayResult)
           .done();

        }
    });

}

//----------------------------------------
//turn the light full or off
function turnLightFullOrOff(_user_id, _state){
  //get the ipaddress, username and lightname of the given user
  var user_table = db.collection("user_table");
  user_table
    .find({user_id : _user_id}) //find all the documents that has this user_id
    .sort({timestamp : -1}) //sort it based on its timestamp in discending order
    .limit(1) //get only the first document
    .toArray(function(err, items){
      if(err){
        //if there is an error
        console.log('There was an error' + err);

      } else {
        //if there is no error
        console.log("User data successfully retrieved for " + _user_id + " as bellow: ");
        console.log(JSON.stringify(items));

        //create new hue api with the bridge's ip adress and username registered on it
        var api = new HueApi(items[0].bridge_ip, items[0].bridge_username);

        //state to be passed to hue api
        var state = lightState.create();

            if(_state == "full"){
              console.log("turned full");

              // Set light state to 'on' with warm white value of 500 and brightness set to 100%
              state.on().white(255, 255);
              api.setLightState(items[0].light_id, state)
                .then(displayResult)
                .done();

            } else if(_state == "off"){
              console.log("turned off");

              // Set light state to 'on' with warm white value of 500 and brightness set to 100%
              state.off();
              api.setLightState(items[0].light_id, state)
                .then(displayResult)
                .done();

            }
      }
    });

}



//================================================
//routing functions
//================================================

//--------------------------------------------------------------------------------
app.get('/:user_id/auto', function(req, res){
  console.log('There was an access to AUTO page by ' + req.params.user_id + ".");

  var data = {}; //data to be passed to the client
  data.user_id = req.params.user_id; //parse user id from the query string and add it to data

  //turn on the polling status of the user
  switchPolling(req.params.user_id, true);

  //retrieve items from schedule_table in db
  var schedule_table = db.collection("schedule_table");
  schedule_table
    .find({user_id : req.params.user_id}) //find all the documents that has this user_id
    .sort({timestamp : -1}) //sort it based on its timestamp in discending order
    .limit(1) //get only the first document
    .toArray(function(err, items){
      if(err){
        //if there is an error
        console.log('There was an error' + err);

        //set tentative data
        data.pt2_time   = 9;
        data.pt2_bri    = 80;
        data.pt3_time   = 12;
        data.pt3_bri    = 15;
        data.color_id   = "white-button";
        data.currentBri = 100;

      } else {
        //if there is no error
        console.log("Schedule data successfully retrieved for " + req.params.user_id + " as below: ");
        console.log(JSON.stringify(items));

        //add each item in the document to data
        data.pt2_time = items[0].pt2_time;
        data.pt2_bri  = items[0].pt2_bri;
        data.pt3_time = items[0].pt3_time;
        data.pt3_bri  = items[0].pt3_bri;
        data.color_id = items[0].color_id;

        //update the light state
        var currentTime = convertCurrentTime(Date.now()); //get current time
        var currentBri = getCurrentBri(currentTime, data.pt2_time, data.pt2_bri, data.pt3_time, data.pt3_bri); //get current brightness
        changeLightColBri(data.user_id, data.color_id, currentBri); //change light color and brightness

        //add current brightness to data
        data.currentBri = currentBri;
        //console.log(currentBri);

      }

      //render a html file with the data and send it to the client
      res.render('layouts/auto', data);

    });
});


//--------------------------------------------------------------------------------
app.get('/:user_id/manual', function(req, res){
  console.log('There was an access to MANUAL page by ' + req.params.user_id + ".");

  var data = {}; //data to be passed to the client
  data.user_id = req.params.user_id;

  //turn off the polling status of the user
  switchPolling(req.params.user_id, false);

  //retrieve items from schedule_table in db
  var schedule_table = db.collection("schedule_table");
  schedule_table
    .find({user_id : req.params.user_id}) //find all the documents that has this user_id
    .sort({timestamp : -1}) //sort it based on its timestamp in discending order
    .limit(1) //get only the first document
    .toArray(function(err, items){
      if(err){
        //if there is an error
        console.log('There was an error' + err);

        //set tentative data
        data.pt2_time   = 9;
        data.pt2_bri    = 80;
        data.pt3_time   = 12;
        data.pt3_bri    = 15;
        data.color_id   = "white-button";
        data.currentBri = 100;

      } else {
        //if there is no error
        console.log("Schedule data successfully retrieved for " + req.params.user_id + " as below: ");
        console.log(JSON.stringify(items));

        //add each item in the document to data
        data.pt2_time = items[0].pt2_time;
        data.pt2_bri  = items[0].pt2_bri;
        data.pt3_time = items[0].pt3_time;
        data.pt3_bri  = items[0].pt3_bri;
        data.color_id = items[0].color_id;

        //update the light state
        var currentTime = convertCurrentTime(Date.now()); //get current time
        var currentBri = getCurrentBri(currentTime, items[0].pt2_time, items[0].pt2_bri, items[0].pt3_time, items[0].pt3_bri); //get current brightness
        changeLightColBri(req.params.user_id, items[0].color_id, currentBri); //change light color and brightness

        //add current brightness to data
        data.currentBri = currentBri;

      }

      //render a html file with the data and send it to the client
      res.render('layouts/manual', data);

    });
  
});


//--------------------------------------------------------------------------------
app.get('/:user_id/addColor', function(req, res){
  var data = {};

  res.render('layouts/addColor', data);
});





//--------------------------------------------------------------------------------
app.post('/:user_id/update_values', function(req, res){
  //if the request has all the nessesary parameters 
  if(req.body.pt2_time && req.body.pt2_bri && req.body.pt3_time && req.body.pt3_bri && req.body.color_id){

      //update values in the database
      var schedule_table = db.collection("schedule_table");
      schedule_table
        .update(
          {user_id : req.params.user_id}, //if there is a document that has this user_id,
          {$set: 
            {
              timestamp : Date.now(),
              pt2_time : req.body.pt2_time, 
              pt2_bri : req.body.pt2_bri, 
              pt3_time : req.body.pt3_time, 
              pt3_bri : req.body.pt3_bri, 
              color_id : req.body.color_id
            } 
          },
          {
            upsert : true
          }, 
          function(err, result){
            if(err){
              //if there is an error
              console.log('There was an error' + err);
            } else {
              //if there is no displayError
              
              //show the updated document
              schedule_table
                .find({user_id : req.params.user_id}) //find all the documents that has this user_id
                .sort({timestamp : -1}) //sort it based on its timestamp in discending order
                .limit(1) //get only the first document
                .toArray(function(err, items){
                  console.log("Schedule data successfully updated for " + req.params.user_id + " as below:");
                  console.log(JSON.stringify(items));

                  //update the light state
                  var currentTime = convertCurrentTime(Date.now()); //get current time
                  var currentBri = getCurrentBri(currentTime, req.body.pt2_time, req.body.pt2_bri, req.body.pt3_time, req.body.pt3_bri); //get current brightness
                  changeLightColBri(req.params.user_id, req.body.color_id, currentBri); //change light color and brightness

                });
            }
          });

  }

  res.end();
});



//--------------------------------------------------------------------------------
app.post('/:user_id/temporal', function(req, res){
  console.log(req.body.mode);
  console.log(req.body.state);
  console.log(req.body.color_id);

  //if the request has all the nessesary parameters 
  if (req.body.mode && req.body.state && req.body.color_id){

    //if the request is from AUTO page
    if (req.body.mode == "auto"){
      switch(req.body.state){
        case "full": //---------------------------------------
          //turn off the polling status of the user
          switchPolling(req.params.user_id, false);
          //change the light color and brightness
          turnLightFullOrOff(req.params.user_id, "full");
          break;

        case "off": //---------------------------------------
          //turn off the polling status of the user
          switchPolling(req.params.user_id, false);
          //change the light color and brightness
          turnLightFullOrOff(req.params.user_id, "off");
          break;

        case "cancel": //---------------------------------------
          //turn on the polling status of the user
          switchPolling(req.params.user_id, true);

          var schedule;
           //retrieve items from schedule_table in db
           var schedule_table = db.collection("schedule_table");
           schedule_table
             .find({user_id : req.params.user_id}) //find all the documents that has this user_id
             .sort({timestamp : -1}) //sort it based on its timestamp in discending order
             .limit(1) //get only the first document
             .toArray(function(err, items){
               if(err){
                //if there is an error
                console.log('There was an error' + err);

              } else {
                //if there is no error
                console.log("Schedule data successfully retrieved for " + req.params.user_id + " as below:");
                console.log(JSON.stringify(items));

                //Return the light state to the original one
                var currentTime = convertCurrentTime(Date.now()); //get current time
                var currentBri = getCurrentBri(currentTime, items[0].pt2_time, items[0].pt2_bri, items[0].pt3_time, items[0].pt3_bri); //get current brightness
                console.log("currentBri: " + currentBri);
                changeLightColBri(req.params.user_id, items[0].color_id, currentBri); //change light color and brightness
              }
            });
      }

    //if the request is from MANUAL page
    } else if (req.body.mode == "manual"){
      switch(req.body.state){
        case "full": //---------------------------------------
          //turn off the polling status of the user
          switchPolling(req.params.user_id, false);
          //change the light color and brightness
          turnLightFullOrOff(req.params.user_id, "full");
          break;

        case "off": //---------------------------------------
          //turn off the polling status of the user
          switchPolling(req.params.user_id, false);
          //change the light color and brightness
          turnLightFullOrOff(req.params.user_id, "off");
          break;

          /*
        default: //---------------------------------------
          //turn on the polling status of the user
          switchPolling(req.params.user_id, false);
          //turn it back 
          changeLightColBri(req.params.user_id, req.body.color_id, req.body.state);
          console.log(req.body.state);
          */

      }
    }
  }

  res.end();
});





//----------------------------------------
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









//================================================
//for db test
//================================================
//----------------------------------------
//test schedule_table
app.get('/:user_id/test_schedule', function(req, res){
  var schedule_table = db.collection("schedule_table");
  
  var user_id = req.params.user_id;
  var timestamp = Date.now();
  var pt2_time = 12;
  var pt2_bri = 100;
  var pt3_time = 15;
  var pt3_bri = 15;
  var color_id = "orange-button";

  var data = {
      user_id : user_id,
      timestamp : timestamp,
      pt2_time : pt2_time, 
      pt2_bri : pt2_bri, 
      pt3_time : pt3_time, 
      pt3_bri : pt3_bri, 
      color_id : color_id
  };

  schedule_table.insert(data,
    function(err, count){
      if(err){
        console.log('There was an error' + err);
      } else {
       console.log("data added: " + data);
     }
    }
  );

  res.send(data);
});

//----------------------------------------
//test user_table
app.get('/:user_id/test_user', function(req, res){
  var user_table = db.collection("user_table");
  
  var user_id = req.params.user_id;
  var timestamp = Date.now();
  var user_pw = "password";
  var email = "test@gmail.com";
  var bridge_ip = "128.122.151.166"; //128.122.151.166 itp    //192.168.2.5 home
  var bridge_username = "matanseiya"; //matanseiya itp    //seiyakobayashi home
  var light_name = "MaTanSeiya2"; // MaTanSeiya  itp   //seiyalight1 home
  var light_id = 6;  // 5  itp    4 home
  var polling_status = true;

  var data = {
      user_id : user_id,
      timestamp : timestamp,
      user_pw : user_pw,
      email : email,
      bridge_ip : bridge_ip,
      bridge_username : bridge_username,
      light_name : light_name,
      light_id : light_id,
      polling_status : polling_status
  };

  user_table.insert(data,
    function(err, count){
      if(err){
        console.log('There was an error' + err);
      } else {
       console.log("data added: " + data);
     }
    }
  );

  res.send(data);
});










//================================================
//mongo connection & port assignment
//================================================
MongoClient.connect(MONGO_URL, function(_err, _db){
    if(_err){
      console.log('There was an error..' + _err);
    }
    db = _db;
    console.log('Connected to mongo!!');
    //console.log(db);

    var server = app.listen(8080, function(){
    console.log('Listening on port %d', server.address().port);
  });
})

// //============================================
// //server setup
// var server = app.listen(8080, function(){
//   console.log('Listening on port %d', server.address().port);
// });