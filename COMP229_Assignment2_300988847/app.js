/*
	Filename: app.js
	Name: Abdulkadir Musse
	Student ID: 300988847
	Date: 2022-10-21
*/

/* Include the database file that connects with MongoDB Server */
var db=require('./db/db');
var port=process.env.PORT || 8080;
var express = require('express');
var app = express();
var session = require('express-session');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Sets up session middleware for handling user logon status */
app.use(session({
	secret: 'very$ecure@pp69',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));


var router=require('./routes/index.js');
app.set('view engine', 'ejs');

app.use("/",router);
app.use("/public", express.static(__dirname + '/public'));

app.listen(port);
console.log('Server is up and running at http://localhost:'+port+'/');

module.exports=app