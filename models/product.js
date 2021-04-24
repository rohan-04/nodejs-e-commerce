const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},

	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User', // creating relations
		required: true,
	},
});

//  'Product' is coverted in lowercase in plural form in DB
//  this is what the name of collection shown
module.exports = mongoose.model('Product', productSchema);
