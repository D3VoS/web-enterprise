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
const methodOverride = require('method-override')
const day = 1000*60*60*24;

const initializePassport = require('./configs/passport-config');
const user = require('./models/User');
initializePassport(passport,
  email => user.findOne({"email": email}),
  id => user.findOne({"_id": id}))


//https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash())
app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: false
}))

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
  console.log(typeof(req))
  res.redirect('/accounts/login')
}

app.use('/accounts', accounts)
app.use('/comments', comments)
app.use('/events', events)

app.listen(PORT)
console.log('Express Server running on port ' + PORT);


