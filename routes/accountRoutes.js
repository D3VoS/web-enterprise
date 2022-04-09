const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const User = require('../models/User')
const bcrypt = require('bcrypt');
const passport = require('passport')
const pass = process.env.DBPASS
mongoose.connect("mongodb+srv://webenterprise:"+pass+"@cluster0.4kxvc.mongodb.net/webenterprise?retryWrites=true&w=majority",()=>{
	console.log("Database Connected")
})


function checkAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		console.log("User Authed")
	  return next()
	}
  
	return res.redirect('/accounts/login')
  }

function checkNotAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		
		return res.redirect('/')
	}
	console.log("User not authed")
	next()
}

router.get('/login', checkNotAuthenticated, (req,res) =>{
	res.render('login');
  });

router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/accounts/login',
	failureFlash: true
	}));

router.get('/profile',checkAuthenticated, async (req,res) =>{
	result = await req.user.exec()
	console.log(result.email)
	res.render('profile', {"email": result})
})

router.post('/profile', checkAuthenticated, async (req, res) =>{
	if (req.body.message === "delete"){
		result = await req.user.exec()
		await User.deleteOne({"_id":result._id})
		console.log("User deleted")
		req.session.destroy();
		res.redirect('/')
	}
})

router.get('/logout', (req,res)=>{
	req.session.destroy();
	res.redirect('/')
})
  
router.get('/register', checkNotAuthenticated, (req,res) => {
	res.render('register')

})
router.post('/register', checkNotAuthenticated, async (req, res) => {
	try{
	result = await User.findOne({"email": req.body.email})
	if(result){
		console.log("Email already exists")
		res.send("409")
	} else{
		// Salts and hashes the password to ensure that it is not in plain text or easily crackable.
		const hashedPassword = await bcrypt.hash(req.body.pass, 10)
		var user = await new User({"email": req.body.email, "password": hashedPassword, "admin":false})
		await user.save()
		console.log("User Saved")
		res.send("200")
		}
	}catch (err){
		console.log(err)
		res.send("500")
	}
			
	})

module.exports = router