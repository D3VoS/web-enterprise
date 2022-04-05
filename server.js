const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const DBURI = process.env.DBURI || "mongodb://127.0.0.1:27017";
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const bodyParser = require("body-parser");
const accounts = require('./routes/accountRoutes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.route('/').get(function(req,res){
  res.render('index')
})

app.use('/accounts', accounts)

app.listen(PORT);
console.log('Express Server running on port ' + PORT);