const express = require('express')
const router = express.Router()


router.use((req,res,next) =>{
	console.log('Time: ', Date.now())
	next()
})

router.get('/login', (req,res) =>{
	res.render('login');
  });
  
router.get('/register', (req,res) => {
	res.render('register')
}).post(function(req,res){
	var email = req.body.email
	var pass = req.body.pass
	res.end("200");
})

module.exports = router