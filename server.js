const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const port = PORT;
const DBURI = process.env.DBURI || "mongodb://127.0.0.1:27017";
const MongoClient = require('mongodb').MongoClient;
const path = require('path')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.route('/').get(function(req,res){
  res.render('index')
})

app.route('/login').get(function(req,res){
  res.render('login')
});


app.listen(PORT);
console.log('Express Server running on port '.PORT);