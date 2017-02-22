var mongoose   = require('mongoose');

var Schema       = mongoose.Schema;

var khachSchema   = new Schema({
	GhiChu: String,
	DiaChi: String,
	LoaiXe: { type: Number, ref: 'LoaiXe' },
	lat: String,
	lng: String
});

module.exports = mongoose.model('Khach', khachSchema,'khach');