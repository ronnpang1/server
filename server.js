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
app.use(function(err, req, res, next) {
    if(!err) return next(); // you also need this line
    console.log("error!!!");
    res.send("error!!!");
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

app.post('/location', function(req, res) {
	console.log("test");
	console.log(req.body.lat);
    res.send(200, {text: "test"});
});


app.get('/secured/ping', function(req, res) {
  res.send(200, {text: "All good. You only get this message if you're authenticated"});
});


app.post('/feed', function(req, res) {
	var lat=req.body.lat;
	var lng=req.body.lng;
  var MongoClient = require("mongodb").MongoClient;//connect to db
	//GEONEAR command
	//returns everything around the given coordinates within a distance of 20000 meters(20km)
	//returns an array of results from the msg collection from the closest to the furthest
	MongoClient.connect("mongodb://otodb:ronnie@ds031872.mongolab.com:31872/heroku_app37116363", function (err, db) {
    if (!err) {
	  
	 db.command({
			
     geoNear: "msgs1",
     near: { type: "Point", coordinates: [ lng, lat ] },
     query:{group:"public"},
     count: "msg",
     maxDistance: 20000,
     num:1000,
     spherical: true,
    //callback returns result
   }, function (err, result) {
			console.log("NUMBER!");
			//console.log(result.dis);
			
			i=0;
			var myarr = [];
			for(var i=0;i<result.results.length;i++)
			{
				num=i;
				if(result.results[num].dis < result.results[num].obj.rad)
				{
				console.log("within rad");
				console.log(result.results[num].obj.msg);
				console.log(result.results[num].dis);
				myarr.push(result.results[num].obj);
				
				}
				
				else
				{
					
				console.log("outside radii");	
				console.log(result.results[num].obj.msg);
				console.log(result.results[num].dis);
				result.results[num].obj.rad
					
				}
				
				
			}
			
			res.send(200,{data:myarr});
				if(err)
				{
					
				res.send(404);
					
				}
				
		
			
				
				
            
        });
    }
});
		
});


app.post('/addmsg', function(req,res){
	var MongoClient = require("mongodb").MongoClient;
	MongoClient.connect("mongodb://otodb:ronnie@ds031872.mongolab.com:31872/heroku_app37116363", function(err, db) {
	var msg=req.body.text;
	var lat=req.body.lat;
	var lng=req.body.lng;
	var rad=req.body.rad;
	if(err) 
  
  { 
	  return console.dir(err); 
		
  }
  var collection = db.collection('msgs1');
  collection.insert(
  
  
  {
	 
	  "location":[lng,lat],
	  "msg" : msg,
	  "user":"test@gmail.com",
	  "rad":rad,
	  "upvote":1,
	  "downvote":1,
	  "votetotal":0,
	  "type":"post",
	  "report":1,
	  "media":"text",
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
