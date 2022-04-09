const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
	email: String,
	admin: Boolean,
	password: String

})

module.exports = mongoose.model("User", userSchema)