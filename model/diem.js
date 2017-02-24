var mongoose   = require('mongoose');

var Schema       = mongoose.Schema;

var diemSchema   = new Schema({
	DiaChi: String,
	lat: String,
	lng: String,
	TinhTrang: Number // // -1=chua xac dinh, 0=dang xac dinh, 1=da xac dinh
});

module.exports = mongoose.model('Diem', diemSchema,'diem');