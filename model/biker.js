var mongoose   = require('mongoose');

var Schema       = mongoose.Schema;

var bikerSchema   = new Schema({
	HoTen: String,
	DienThoai: String,
	DiaChi: String,
	lat: String,
	lng: String
});

module.exports = mongoose.model('Biker', bikerSchema,'biker');