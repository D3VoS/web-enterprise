const express = require('express');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');
const bodyParser = require("body-parser");
const accounts = require('./routes/accountRoutes');
const db = require('./util/db')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.route('/').get(function(req,res){
  res.render('index')
})

app.use('/accounts', accounts)

db.connect( () =>{
  app.listen(PORT)
  console.log('Express Server running on port ' + PORT);
})

