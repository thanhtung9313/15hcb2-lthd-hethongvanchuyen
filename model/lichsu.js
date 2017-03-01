var mongoose   = require('mongoose');

var Schema       = mongoose.Schema;

var lichsuSchema   = new Schema({
	Khach : {type: Schema.Types.ObjectId, ref : 'Khach'},
	Diem : {type: Schema.Types.ObjectId, ref : 'Diem'},
	Ngay: { type: Date, default: Date.now },
	TinhTrang: Number // 1=coXe, -1=DiaChiGoc, 0=DaXacDinhToaDo, 3=KhongCoXeNhan, 2=DangTimXe
});

module.exports = mongoose.model('LichSu', lichsuSchema,'lichsu');