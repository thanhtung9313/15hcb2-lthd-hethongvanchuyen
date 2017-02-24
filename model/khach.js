var mongoose   = require('mongoose');

var Schema       = mongoose.Schema;

var khachSchema   = new Schema({
	HoTen: String,
	DienThoai: String,
	GhiChu: String,
	DiaChi: String,
	LoaiXe: { type: Number, ref: 'LoaiXe' }
});

module.exports = mongoose.model('Khach', khachSchema,'khach');