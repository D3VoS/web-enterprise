const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const Comment = require('../models/Comment')
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
	comments = await Comment.find({}).populate({'path': 'createdBy', 'select': 'displayName _id'})
	user = await req.user.exec()
	res.render("comments", {"comments": comments, "user": user})
})

router.post('/', checkAuthenticated, async (req,res) =>{
	console.log(req.body.message)
	if (req.body.message === "add"){
		content = req.body.content;
		user = await req.user.exec()
		comment = await Comment.create({"content": content, "createdBy": user._id})
		console.log(comment)
		res.send("success")
	} else if (req.body.message === "delete"){
		await Comment.deleteOne({"_id": req.body.id})
		console.log("Comment Deleted")
		res.send("success")
	} else if(req.body.message === "update"){
		console.log("here")
		await Comment.findOneAndUpdate({"_id": req.body._id}, {"content": req.body.content, "updatedAt": Date.now()})
		res.send("success")
	} else if(req.body.message === "ban"){
		ad = await req.user.exec()
		if(ad.admin){
			console.log("Banning User")
			console.log(req.body.id)
			comment = await Comment.findById({"_id":req.body.id})
			id = comment.createdBy
			user = await User.updateOne({"_id": id}, {"banned": true, "bannedReason": req.body.reason})
			console.log(user)
			await Comment.deleteMany({"createdBy": id})
			await Event.updateMany({}, {"$pullAll": {"attending":[{"_id":id}]}})
			console.log(user)
		}
	}
})

module.exports = router