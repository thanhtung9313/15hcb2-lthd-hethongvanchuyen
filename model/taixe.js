var mongoose   = require('mongoose');

var Schema       = mongoose.Schema;

var taixeSchema   = new Schema({
	HoTen: String,
	DienThoai: String,
	DiaChi: String,
	LoaiXe: { type: Number, ref: 'LoaiXe' },
	TinhTrang: Number, //-1: chưa đăng nhập, 0: chưa chở khách và đã đăng nhập, 1: đã chở khách
	lat: String,
	lng: String
});

module.exports = mongoose.model('TaiXe', taixeSchema,'taixe');