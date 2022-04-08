const express = require('express');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const cookieParser = require('cookie-parser')
const sessions = require('express-session')
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');
const bodyParser = require("body-parser");
const accounts = require('./routes/accountRoutes');
const db = require('./util/db')
const day = 1000*60*60*24;

//https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
app.use(sessions({secret: process.env.SECRETKEY, saveUninitialized:true,cookie:{maxAge:day},resave:false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.static(__dirname));
app.use(cookieParser())

app.route('/').get(function(req,res){
  if (req.session.userid){
    res.render('index', {"email": session.userid})
  } else{
    res.render('index')
  }
})

app.use('/accounts', accounts)

db.connect( () =>{
  app.listen(PORT)
  console.log('Express Server running on port ' + PORT);
})

