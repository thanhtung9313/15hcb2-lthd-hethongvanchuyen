var TaiXe = require('../model/taixe');
var Khach = require('../model/khach');
var LoaiXe = require('../model/loaixe');
var Diem = require('../model/diem');
var LichSu = require('../model/lichsu');
var Promise = require('bluebird');
var querystring = require('querystring');
const https = require('https');

module.exports = {
	GeoCoding : function(m,callback) {
		var data = querystring.stringify({address:m.DiaChi,key:process.env.npm_package_config_apikey});
		var surl = 'maps.googleapis.com';
		var spath='/maps/api/geocode/json?'+data;
		var options = {
			host: surl,
			path: spath,
			method: 'GET',
			accept: '*/*',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		};
		var httpreq = https.request(options, function (response) {
			response.setEncoding('utf8');
			var data  = '';
			response.on('data', function (chunk) {
				if(('' + response.statusCode).match(/^2\d\d$/)) {
					data += chunk;
				}
				else {
					callback({ Error : 1, Text : "Có lỗi xảy ra với google map api" });
				}
			});
			response.on('end', function() {
				data = JSON.parse(data);
				if(data.results.length != 0){
					callback({ Error : 0, Text : "Geocoding thành công", Data: data});
				}
				else{
					callback ({ Error : 1, Text : "Địa chỉ không geocoding được" });
				}
			});
		});
		
		httpreq.on('error', function (e) {
			callback ({ Error : 1, Text : "Có lỗi server down google map api" });
		});
		httpreq.on('timeout', function () {
			req.abort();
			callback({ Error : 1, Text : "Có lỗi server timeout với google map api" });
		});
		httpreq.setTimeout(30*1000);
		httpreq.end();
	},
	
	DistanceMatrix : function(m,des,callback) {
		var data = querystring.stringify({origins:m.lat+','+m.lng,destinations:des,units:'metric',mode:'driving',key:process.env.npm_package_config_apikey});
		var surl = 'maps.googleapis.com';
		var spath='/maps/api/distancematrix/json?'+data;
		var options = {
			host: surl,
			path: spath,
			method: 'GET',
			accept: '*/*'
		};
		var httpreq = https.request(options, function (response) {
			response.setEncoding('utf8');
			var data  = '';
			response.on('data', function (chunk) {
				if(('' + response.statusCode).match(/^2\d\d$/)) {
					data += chunk;
				}
				else {
					callback({ Error : 1, Text : "Có lỗi xảy ra với google map api" });
				}
			});
			response.on('end', function() {
				data = JSON.parse(data);
				if(data.rows.length != 0 && data.rows[0].elements.length != 0){
					callback({ Error : 0, Text : "Distance Matrix thành công", Data: data });
				}
				else{
					callback({ Error : 1, Text : "Distance Matrix không thành công" });
				}
			});
		});
		httpreq.on('error', function (e) {
			callback({ Error : 1, Text : "Có lỗi server down google map api" });
		});
		httpreq.on('timeout', function () {
			req.abort();
			callback({ Error : 1, Text : "Có lỗi server timeout với google map api" });
		});
		httpreq.setTimeout(30*1000);
		httpreq.end();
	}
}
