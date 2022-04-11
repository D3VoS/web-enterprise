const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const User = require('../models/User')
const bcrypt = require('bcrypt');
const passport = require('passport')
mongoose.connect(process.env.MONGO_URL,(err)=>{
	if (err){
		console.log(err)
	}
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
		await User.deleteOne({"_id":result._id})
		console.log("User deleted")
		req.logout()
		res.status(200).send("success")
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
	result = await User.findOne({"email": req.body.email})
	if(result){
		console.log("Email already exists")
		res.send("409")
	} else{
		// Salts and hashes the password to ensure that it is not in plain text or easily crackable.
		const hashedPassword = await bcrypt.hash(req.body.pass, 10)
		var user = await new User({"email": req.body.email, "password": hashedPassword, "displayName": req.body.displayName})
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