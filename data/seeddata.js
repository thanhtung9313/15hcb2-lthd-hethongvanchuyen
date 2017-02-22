var TaiXe = require('../model/taixe');
var Khach = require('../model/khach');
var LoaiXe = require('../model/loaixe');

module.exports = {
	init : function(){
		
		TaiXe.remove({}, function (err) {
		  if (err) console.log(err);
		});
		
		TaiXe.create({ 
		"LoaiXe" : 0,
		"HoTen": "Nguyễn Văn A",
		"DienThoai": "090123451",
		"DiaChi": "227 Nguyễn Văn Cừ Quận 5 TPHCM",
		"TinhTrang": 0, 
		"lat" : "10.762469",
		"lng" : "106.6826266" },function (err) { if(err) console.log(err);});
		
		TaiXe.create({ 
		"LoaiXe" : 0,
		"HoTen": "Nguyễn Văn B",
		"DienThoai": "090123452",
		"DiaChi": "202 nguyễn văn cừ quận 5 tphcm",
		"TinhTrang": 0, 
		"lat" : "10.7622341",
		"lng" : "106.6825639" },function (err) { if(err) console.log(err);});
		
		TaiXe.create({ 
		"LoaiXe" : 0,
		"HoTen": "Nguyễn Văn C",
		"DienThoai": "090123453",
		"DiaChi": "180 nguyễn văn cừ quận 5 tphcm",
		"TinhTrang": 0, 
		"lat" : "10.7622341",
		"lng" : "106.6825639" },function (err) { if(err) console.log(err);});
		
		TaiXe.create({ 
		"LoaiXe" : 0,
		"HoTen": "Nguyễn Văn D",
		"DienThoai": "090123454",
		"DiaChi": "100 nguyễn văn cừ quận 5 tphcm",
		"TinhTrang": 0, 
		"lat" : "10.763963",
		"lng" : "106.6818997" },function (err) { if(err) console.log(err);});
		
		TaiXe.create({ 
		"LoaiXe" : 0,
		"HoTen": "Nguyễn Văn E",
		"DienThoai": "090123455",
		"DiaChi": "90 nguyễn văn cừ quận 5 tphcm",
		"TinhTrang": 0, 
		"lat" : "10.7622341",
		"lng" : "106.6825639" },function (err) { if(err) console.log(err);});
		
		TaiXe.create({ 
		"LoaiXe" : 0,
		"HoTen": "Nguyễn Văn F",
		"DienThoai": "090123456",
		"DiaChi": "90 nguyễn văn cừ quận 5 tphcm",
		"TinhTrang": 0, 
		"lat" : "10.7622341",
		"lng" : "106.6825639" },function (err) { if(err) console.log(err);});
		
		TaiXe.create({ 
		"LoaiXe" : 0,
		"HoTen": "Nguyễn Văn G",
		"DienThoai": "090123457",
		"DiaChi": "400 nguyễn văn cừ quận 5 tphcm",
		"TinhTrang": 0, 
		"lat" : "10.762469",
		"lng" : "106.6826266" },function (err) { if(err) console.log(err);});
		
		TaiXe.create({ 
		"LoaiXe" : 0,
		"HoTen": "Nguyễn Văn H",
		"DienThoai": "090123458",
		"DiaChi": "500 nguyễn văn cừ quận 5 tphcm",
		"TinhTrang": 0, 
		"lat" : "10.7622341",
		"lng" : "106.6825639" },function (err) { if(err) console.log(err);});
		
		TaiXe.create({ 
		"LoaiXe" : 0,
		"HoTen": "Nguyễn Văn I",
		"DienThoai": "090123459",
		"DiaChi": "600 nguyễn văn cừ quận 5 tphcm",
		"TinhTrang": 0, 
		"lat" : "10.7622341",
		"lng" : "106.6825639" },function (err) { if(err) console.log(err);});
		
		TaiXe.create({ 
		"LoaiXe" : 0,
		"HoTen": "Nguyễn Văn J",
		"DienThoai": "090123460",
		"DiaChi": "800 nguyễn văn cừ quận 5 tphcm",
		"TinhTrang": 0, 
		"lat" : "10.7622341",
		"lng" : "106.6825639" },function (err) { if(err) console.log(err);});
		
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