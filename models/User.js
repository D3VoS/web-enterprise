const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		require: true,
		lowercase: true,
	},
	admin: {
		type: Boolean,
		default: false,
	},
	password: {
		type: String,
		required: true,
	},
	displayName: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 32
	},
	createdAt: {
		type: Date,
		immutable: true,
		default: () => Date.now()
	},
	updatedAt: {
		type: Date,
		default: () => Date.now()
	},

})

module.exports =  mongoose.model("User", userSchema)