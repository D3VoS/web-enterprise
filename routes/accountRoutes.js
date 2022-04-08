const express = require('express')
const router = express.Router()
const db = require('../util/db')
const mongoose = require("mongoose")
const User = require('../models/User')
const pass = process.env.DBPASS
mongoose.connect("mongodb+srv://webenterprise:"+pass+"@cluster0.4kxvc.mongodb.net/webenterprise?retryWrites=true&w=majority",()=>{
	console.log("Database Connected")
})




router.use((req,res,next) =>{
	next()
})
router.get('/login', (req,res) =>{
	session = req.session;
	if (session.userid){
		res.render('index', {"email": session.userid})
	}
	res.render('login');
  });

router.post('/login', (req,res) =>{
	db.get().collection('users').findOne({"email": req.body.email, "pass": req.body.pass}).then(result => {
		if (result){
			session = req.session;
			session.userid=req.body.email;
			console.log(req.session)
			res.redirect("/")
		}
		
	})
});

router.get('/profile', (req,res) =>{
	session = req.session
	if (session.userid){
		res.render('profile', {"email": session.userid})
	}
})

router.get('/logout', (req,res)=>{
	req.session.destroy();
	res.redirect('/')
})
  
router.get('/register', (req,res) => {
	if (req.session.userid){
		res.redirect('index')
	} else{
		res.render('register')
	}
})
router.post('/register', (req, res) => {
	User.findOne({"email": req.body.email}).then(result =>{
		console.log(result)
		if(result){
			console.log("Email already exists")
			res.send("409")
		} else{
			var user = new User({"email": req.body.email, "password": req.body.pass, "admin":false})
			user.save().then( () => {
				console.log("User Saved")
				res.send("200")
			})
			
	}
})
})

module.exports = router