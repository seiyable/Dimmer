//server program for the first hue app
//authors: Seiya Kobayashi
//last updated: 2/17/2015
//version: 0.1

//================================================
//require
var express = require('express');
var exphbs  = require('express3-handlebars');
var app = express();
var bodyParser = require('body-parser');

//use static local files
app.use(express.static(__dirname + '/public'));
//handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//body parser
app.use(bodyParser());

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

/*
//response to the POST request for the MANUAL page
app.post('/', function(req, res){

  //--- initialize variables for response ---
  var destination;

  //--- take values from request ---
  if (req.body.destination){
     destination = req.body.destination;
  }

  //--- set data into the data object for response ---
  var data = {};
  data.destination = destination;

  res.render('layouts/manual', data);
});
*/


//============================================
//server setup
var server = app.listen(8080, function(){
  console.log('Listening on port %d', server.address().port);
});