var http = require('http');
var express = require('express');
var cors = require('cors');
var app = express();
var jwt = require('express-jwt');
var dotenv = require('dotenv');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk("mongodb://otodb:ronnie@ds031872.mongolab.com:31872/heroku_app37116363");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

dotenv.load();

var authenticate = jwt({
  secret: new Buffer('7S5591OgMI6FBeaqAxwk2cBJwlHkrg3r', 'base64'),
  audience: '7S5591OgMI6FBeaqAxwk2cBJwlHkrg3r' 
});


app.configure(function () {

 // Request body parsing middleware should be above methodOverride
  app.use(express.bodyParser());
  app.use(express.urlencoded());
  app.use(express.json());

  app.use('/secured', authenticate);
  app.use(cors());

  app.use(app.router);
});


app.get('/ping', function(req, res) {
  res.send(200, {text: "All good. You don't need to be authenticated to call this"});
});

app.get('/test', function(req, res) {
	console.log("test");
	console.log(req.body);
	console.log(req.body.text);
    res.send(200, {text: "test"});
});

app.post('/test1', function(req, res) {
	console.log("test");
	console.log(req.body);
    res.send(200, {text: "test"});
});


app.get('/secured/ping', function(req, res) {
  res.send(200, {text: "All good. You only get this message if you're authenticated"});
});


app.post('/addmsg', function(req,res){
	var MongoClient = require("mongodb").MongoClient;
	MongoClient.connect("mongodb://otodb:ronnie@ds031872.mongolab.com:31872/heroku_app37116363", function(err, db) {
	var msg=req.body.text;
	var lat=req.body.lat;
	var lng=req.body.lng;
	if(err) 
  
  { 
	  return console.dir(err); 
		
  }
  var collection = db.collection('msg');
  collection.insert(
  
  
  {
	  "msg":msg,
	  "messgloc":[lat,lng],
	  "rad":1000,
	  "group":"public"
  }, function(err, result)
  {
	  
	if(err)
	{
	console.log(err);
	res.send(404, {text: "test"});
	}	
	
	else
	{
	console.log("information has been added");
	res.send(200, {text: "test"}); 
	}
	  
  });
  });
}); 

var port = process.env.PORT || 3001;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});
