/* global ValidationID */
/* global ObjectId */
var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var XWalkVersionSchema = new Schema({
	branchname: { type:String, required: true, index: { unique: true } },
	branchversion: String,
	builddate: Date
});

// return the model
module.exports = mongoose.model('XWalkVersion', XWalkVersionSchema);