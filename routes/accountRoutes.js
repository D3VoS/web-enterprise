const express = require('express')
const router = express.Router()
const db = require('../util/db')

router.use((req,res,next) =>{
	console.log('Time: ', Date.now())
	next()
})
router.get('/login', (req,res) =>{
	res.render('login');
  });
  
router.get('/register', (req,res) => {
	res.render('register')
})
router.post('/register', (req, res) => {
	db.get().collection('users').findOne({"email": req.body.email}).then(result =>{
		console.log(result)
		if (result){
			console.log("Email already exists")
			res.send("409")
		} else{
			db.get().collection('users').insertOne({"email": req.body.email, "pass": req.body.pass}).then(result => {
				console.log("User Inserted")
				res.send("200")
			})
			
		}
	})
})

module.exports = router