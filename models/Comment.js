const mongoose = require("mongoose")
const User = require("./User")

const CommentSchema = new mongoose.Schema({
	content: {
		type: String,
		minlength: 2
	},
	createdAt: {
		type: Date,
		default: () => Date.now()
	},
	updatedAt: {
		type: Date,
		default: () => Date.now()
	},
	createdBy: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'User'}
})

module.exports = mongoose.model("Comment", CommentSchema)