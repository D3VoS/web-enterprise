const mongoose = require("mongoose")
const User = require("../models/User")

const EventSchema = new mongoose.Schema({
	title: String,
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
	attending: [
		{
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'User'
		}],
})

module.exports = mongoose.model("Event", EventSchema)