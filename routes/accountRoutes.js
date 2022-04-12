const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const User = require('../models/User')
const Comment = require('../models/Comment')
const Event = require('../models/Event')
const bcrypt = require('bcrypt');
const passport = require('passport')
const pass = process.env.DBPASS
const username = process.env.DBUSER
mongoose.connect("mongodb+srv://"+username+":"+pass+"@cluster0.4kxvc.mongodb.net/webenterprise?retryWrites=true&w=majority",(err)=>{
	if (err){
		console.log(err)
	}
	console.log("Database Connected")
})

// Simple Auth Decorator like function
function checkAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		console.log("User Authed")
	  return next()
	}
  
	return res.redirect('/accounts/login')
  }
// Same as above but in reverse, checking if user is not authed (logged in)
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
// passport used to with local strategy, see config/passport-config.js
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/',
	failureFlash: true
	}));

router.get('/profile',checkAuthenticated, async (req,res) =>{
	result = await req.user.exec()
	console.log(result)
	res.render('profile', {"result": result})
})

router.post('/profile', checkAuthenticated, async (req, res) =>{
	if (req.body.message === "delete"){
		result = await req.user.exec()
		req.logout()
		await User.deleteOne({"_id":result._id})
		await Event.updateMany({}, {"$pullAll": {"attending":[{"_id":result._id}]}})
		await Comment.deleteMany({"createdBy": result._id})
		console.log("User deleted")
		res.send("success")
		
		
	} else if (req.body.message === "update"){
		result = await req.user.exec()
		doc = await User.findOneAndUpdate({"_id": result._id}, {"displayName": req.body.displayName, "updatedAt": Date.now()}, {new: true})
		console.log("User Updated")
		res.status(200).send("success")
	}
})

router.get('/logout', checkAuthenticated, (req,res)=>{
	req.logout()
	res.redirect('/')
})
  
router.get('/register', checkNotAuthenticated, (req,res) => {
	res.render('register')

})
router.post('/register', checkNotAuthenticated, async (req, res) => {
	try{
		// Checks if email is already taken
	result = await User.findOne({"email": req.body.email})
	if(result){
		console.log("Email already exists")
		res.send("409")
	} else{
		// Salts and hashes the password to ensure that it is not in plain text or easily crackable.
		const hashedPassword = await bcrypt.hash(req.body.pass, 10)
		var user = await new User({"email": req.body.email, "password": hashedPassword, "displayName": req.body.displayName})
		// Creates and saves the user
		await user.save()
		console.log("User Saved")
		res.send("200")
		}
	}catch (err){
		console.log(err)
		res.send("500")
	}
})

router.get('/admin', checkAuthenticated, async(req, res) =>{
	user = await req.user.exec()
	if(user.admin){
		bannedUsers = await User.find({"banned": true})
		res.render("admin", {"bannedUsers": bannedUsers})
	} else{
		res.redirect("/")
	}
})

router.post('/admin', checkAuthenticated, async(req, res) =>{
	user = await req.user.exec()
	if(user.admin){
		await User.updateOne({"_id": req.body.id}, {"banned": false, "bannedReason": " "})
		res.send("success")
	} else{
		res.redirect("/")
	}
})
			
	

module.exports = router