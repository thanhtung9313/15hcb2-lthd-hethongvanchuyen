var mongoose   = require('mongoose');

var Schema       = mongoose.Schema;

var loaixeSchema   = new Schema({
	_id: Number,
	Ten: String
});

module.exports = mongoose.model('LoaiXe', loaixeSchema,'loaixe');