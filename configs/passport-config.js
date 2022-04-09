// https://www.youtube.com/watch?v=-RCnNyD0L-s&ab_channel=WebDevSimplified
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')



function initialize(passport, getUserByEmail, getUserById){
	 const authenticateUser = async (email, password, done) => { 
		console.log(email)
		console.log(password)
		const user = await getUserByEmail(email)
		if (user == null){
			return done(null, false, {message: 'No user with the specified email'})
		}
		try{
			if (await bcrypt.compare(password, user.password)){
				console.log("Authenticated")
				return done(null, user)
			} else{
				return done(null, false, {message: 'password incorrect'})
			}
		} catch (e){
			return done(e)
		}
	}
	
	passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'pass'}, authenticateUser))
	passport.serializeUser((user, done) => done(null, user._id))
	passport.deserializeUser((id, done) => {
		return done(null, getUserById(id))
	})

}

module.exports = initialize