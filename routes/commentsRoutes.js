const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const Comment = require('../models/Comment')
const User = require('../models/User')

function checkAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		console.log("User Authed")
	  return next()
	}
  
	return res.redirect('/accounts/login')
  }

router.get('/', checkAuthenticated, async (req, res) =>{
	comments = await Comment.find({})
	user = await req.user.exec()
	res.render("comments", {"comments": comments, "user": user})
})

router.post('/', checkAuthenticated, async (req,res) =>{
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
	}
})

module.exports = router