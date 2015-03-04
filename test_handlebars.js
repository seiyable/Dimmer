//================================================
//require
//================================================
var express = require('express');
var exphbs  = require('express3-handlebars');

var app = express();

//use static local files
app.use(express.static(__dirname + '/public'));
//handlebars
//app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/test', function(req, res){
	var data = {};
	data.test = 10;

	res.render('layouts/test', data);
});

//server setup
var server = app.listen(8080, function(){
  console.log('Listening on port %d', server.address().port);
});