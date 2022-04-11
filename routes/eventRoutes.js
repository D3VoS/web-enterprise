const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const Event = require('../models/Event')
const User = require('../models/User')

function checkAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		console.log("User Authed")
	  return next()
	}
  
	return res.redirect('/accounts/login')
  }


router.get('/', checkAuthenticated, async (req, res) =>{
	user = await req.user.exec()
	events = await Event.find({"attending": {"$ne": user._id}})
	res.render("events", {"events": events, "user": user})
})

router.post('/', checkAuthenticated, async (req, res) =>{
	
	if(req.body.message === "Join"){
		user = await req.user.exec()
		ev = await Event.findOneAndUpdate({"_id": req.body.id}, {"$addToSet": {"attending": user._id}}, {new:true})
		console.log(ev)
		res.send("success")
	}
})

router.get('/my', checkAuthenticated, async (req, res) =>{
	events = await Event.find({"attending": user._id})
	res.render("eventMy", {"events": events})
})

router.post('/my', checkAuthenticated, async (req, res) =>{
	if(req.body.message === "Leave"){
		user = await req.user.exec()
		ev = await Event.findOneAndUpdate({"_id": req.body.id}, {"$pull": {attending: user._id}}, {new:true})
		console.log(ev)
		res.send("success")
	}
})
router.get('/admin', checkAuthenticated, async(req, res) =>{
	user = await req.user.exec()
	if(user.admin){
		events = await Event.find({}).populate('attending')
		res.render('eventsAdmin', {"user": user, "events": events})
	} else{
		res.redirect('/events/')
	}
})

router.post('/admin', checkAuthenticated, async(req, res) =>{
	user = await req.user.exec()
	if(user.admin){
		if (req.body.message === "create"){
			ev = await Event.create({"title": req.body.title, "content": req.body.content})
			console.log(ev)
			res.send("success")
		} else if(req.body.message === "update"){
			ev = await Event.findOneAndUpdate({"_id": req.body.id}, {"title": req.body.title, "content": req.body.content},{new:true})
			console.log(ev)
			res.send("success")
		} else if(req.body.message === "delete"){
			ev = await Event.deleteOne({"_id": req.body.id})
			res.send("success")
		}
	} else{
		res.redirect('/events/')
	}
})

module.exports = router