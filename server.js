const express = require('express');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const cookieParser = require('cookie-parser')
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');
const bodyParser = require("body-parser");
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const accounts = require('./routes/accountRoutes');
const comments = require('./routes/commentsRoutes')
const events = require('./routes/eventRoutes')


const initializePassport = require('./configs/passport-config');
const user = require('./models/User');
initializePassport(passport,
  email => user.findOne({"email": email}),
  id => user.findOne({"_id": id}))

// Sets up EJS as our templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Makes it so the req.body is easily accessible in a json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Allows sessions to be held.
app.use(flash())
app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: false
}))
// The main driver of authentication on the site
app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser())

app.route('/').get(checkAuthenticated, async function(req,res){
  result = await req.user.exec()
  res.render('index', {"displayName": result.displayName})
})

function checkAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next()
  }
  res.redirect('/accounts/login')
}

app.use('/accounts', accounts)
app.use('/comments', comments)
app.use('/events', events)

app.listen(PORT)
console.log('Express Server running on port ' + PORT);


