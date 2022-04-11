// https://www.youtube.com/watch?v=-RCnNyD0L-s&ab_channel=WebDevSimplified
// Sets the strategy to local - meaning auth with username and pass as opposed to something like google or facebook
const LocalStrategy = require('passport-local').Strategy
// has cryptography methods for salting and hashing passwords
const bcrypt = require('bcrypt')


// Could be done in server.js but this makes life easier
function initialize(passport, getUserByEmail, getUserById){
	// Auth function to authenticate our users
	 const authenticateUser = async (email, password, done) => { 
		 // Gets the user by email
		const user = await getUserByEmail(email)
		// If no user exists let the client know
		if (user == null){
			return done(null, false, {message: 'No user with the specified email'})
		}
		try{
			// compare the hashed and salted passwords
			if (await bcrypt.compare(password, user.password)){
				console.log("Authenticated")
				return done(null, user)
			// If they dont match tell them to do one
			} else{
				return done(null, false, {message: 'password incorrect'})
			}
		} catch (e){
			return done(e)
		}
	}
	// Override what passport will be looking for in the local strat
	passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'pass'}, authenticateUser))
	passport.serializeUser((user, done) => done(null, user._id))
	passport.deserializeUser((id, done) => {
		return done(null, getUserById(id))
	})

}

module.exports = initialize