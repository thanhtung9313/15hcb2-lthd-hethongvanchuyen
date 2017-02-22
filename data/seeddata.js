var TaiXe = require('../model/taixe');
var Khach = require('../model/khach');
var LoaiXe = require('../model/loaixe');

module.exports = {
	init : function(){
		
		TaiXe.remove({}, function (err) {
		  if (err) console.log(err);
		});
		
		/*TaiXe.create({ 
		"LoaiXe" : 0,
		"HoTen": "Nguyễn Văn A",
		"DienThoai": "090123451",
		"DiaChi": "227 Nguyễn Văn Cừ Quận 5 TPHCM",
		"TinhTrang": 0, 
		"lat" : "10.762469",
		"lng" : "106.6826266" },function (err) { if(err) console.log(err);});*/
		
		Khach.remove({}, function (err) {
		  if (err) console.log(err);
		});
		
		LoaiXe.remove({}, function (err) {
		  if (err) console.log(err);
		});
		LoaiXe.create({_id:0, Ten: "Thường"},function(err){if(err) console.log(err)});
		LoaiXe.create({_id:1, Ten: "Premium"},function(err){if(err) console.log(err)});
	}
}