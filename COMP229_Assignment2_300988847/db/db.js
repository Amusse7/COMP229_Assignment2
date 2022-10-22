/*
	Filename: db.js
	Name: Abdulkadir Musse
	Student ID: 300988847
	Date: 2022-10-21
*/


const mongoose=require('mongoose');

var url="mongodb+srv://user01:PropheC69@cluster0.0rpgb.mongodb.net/portfolioAbdul?retryWrites=true&w=majority";
var conn=mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

console.log("Connected to MongoDB");

module.exports=conn;