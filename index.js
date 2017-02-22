var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var https = require('https');
var server = require('http').Server(app);
var io = require('socket.io')(server);

var mongoose   = require('mongoose');
var dbcon=process.env.npm_package_config_dbcon;
mongoose.connect(dbcon);

var TaiXe = require('./model/taixe');
var Khach = require('./model/khach');
var LoaiXe = require('./model/loaixe');

var seeddata = require('./data/seeddata');
seeddata.init();

var router = express.Router()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.npm_package_config_port;

router.get('/', function(req, res) {
	res.json({ message: 'Welcome to transport map api' });   
});

router.route('/register')
.post(function(req, res) {
	var m = req.body;{
					var data = querystring.stringify({address:m.DiaChi,key:process.env.npm_package_config_apikey});
					var surl = 'maps.googleapis.com';
					var spath='/maps/api/geocode/json?'+data;
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
								res.json({ Error : 1, Text : "Có lỗi xảy ra với google map api" });
							}
						});
						response.on('end', function() {
							data = JSON.parse(data);
							if(data.results.length != 0){
								var location = data.results[0].geometry.location;
								Khach.create({
									DiaChi : m.DiaChi,
									GhiChu: m.GhiChu,
									LoaiXe: m.LoaiXe,
									lat: location.lat,
									lng: location.lng
								}, 
								function(err){
									if(err) {
										console.log(err);
										res.json({ Error : 1, Text : "Có lỗi xảy ra ở db thử lại sau" });
									}
									else {
										res.json({ Error : 0, Text : 'Đăng kí thành công' });
										io.emit('reload guest', { Text: 'Có khách mới' });
									}
								});
							}
							else{
								res.json({ Error : 1, Text : "Địa chỉ không tồn tại" });
							}
						});
					});
					httpreq.on('error', function (e) {
						res.json({ Error : 1, Text : "Có lỗi server down google map api" });
						console.log(e);
					});
					httpreq.on('timeout', function () {
						res.json({ Error : 1, Text : "Có lỗi server timeout với google map api" });
						req.abort();
					});
					httpreq.setTimeout(30*1000);
					httpreq.end();	
				}
});

router.route('/register-taixe')
.post(function(req, res) {
	var m = req.body;
	TaiXe.findOne({DienThoai:m.DienThoai},
		function (err, info) {
			if (err) {
				console.log(err);
				res.json({
					Error : 1,
					Text : "Có lỗi xảy ra vui lòng thử lại"
				});
			}
			else{
				if(info != null){
					res.json({
						Error : 1,
						Text : 'Số điện thoại này đã đăng kí rồi'
					});
				}
				else {
					var data = querystring.stringify({address:m.DiaChi,key:process.env.npm_package_config_apikey});
					var surl = 'maps.googleapis.com';
					var spath='/maps/api/geocode/json?'+data;
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
								res.json({ Error : 1, Text : "Có lỗi xảy ra với google map api" });
							}
						});
						response.on('end', function() {
							data = JSON.parse(data);
							if(data.results.length != 0){
								var location = data.results[0].geometry.location;
								TaiXe.create({
									HoTen: m.HoTen,
									DienThoai: m.DienThoai,
									DiaChi : m.DiaChi,
									DienThoai: m.DienThoai,
									lat: location.lat,
									lng: location.lng
								}, 
								function(err){
									if(err) {
										console.log(err);
										res.json({ Error : 1, Text : "Có lỗi xảy ra ở db thử lại sau" });
									}
									else {
										res.json({ Error : 0, Text : 'Đăng kí thành công' });
										io.emit('reload lai xe', { Text: 'Có lái xe mới' });
									}
								});
							}
							else{
								res.json({ Error : 1, Text : "Địa chỉ không tồn tại" });
							}
						});
					});
					httpreq.on('error', function (e) {
						res.json({ Error : 1, Text : "Có lỗi server down google map api" });
						console.log(e);
					});
					httpreq.on('timeout', function () {
						res.json({ Error : 1, Text : "Có lỗi server timeout với google map api" });
						req.abort();
					});
					httpreq.setTimeout(30*1000);
					httpreq.end();	
				}
			}
		}
	);
});

router.route('/taixe')
.get(function(req, res) {
	var m = req.body;
	TaiXe.find({},
		function (err, infos) {
			if (err) {
				console.log(err);
				res.json({
					Error : 1,
					Text : "Có lỗi xảy ra vui lòng thử lại"
				});
			}
			else{
				if(infos.length === 0){
					res.json({
						Error : 1,
						Text : 'Chưa có biker nào'
					});
				}
				else {
					var arr =[];
					infos.forEach(function(info,index){
						arr[index] = {
							name:info.HoTen,
							phone:info.DienThoai,
							location:{
								lat:parseFloat(info.lat),
								lng:parseFloat(info.lng)
							}
						};
					});
					res.json({
						Error : 0,
						Data : arr
					});
				}
			}
		}
	);
});

router.route('/guest')
.get(function(req, res) {
	var m = req.body;
	Khach.find({},
		function (err, infos) {
			if (err) {
				console.log(err);
				res.json({
					Error : 1,
					Text : "Có lỗi xảy ra vui lòng thử lại"
				});
			}
			else{
				if(infos.length === 0){
					res.json({
						Error : 1,
						Text : 'Chưa có khách nào'
					});
				}
				else {
					var arr =[];
					infos.forEach(function(info,index){
						arr[index] = {
							DiaChi : m.DiaChi,
							GhiChu: m.GhiChu,
							LoaiXe: m.LoaiXe,
							location:{
								lat:parseFloat(info.lat),
								lng:parseFloat(info.lng)
							}
						};
					});
					res.json({
						Error : 0,
						Data : arr
					});
				}
			}
		}
	);
});

app.use('/api/map', router);
server.listen(port);
console.log('mapapi run on port ' + port);

io.on('connection', function (socket) {
  socket.emit('hello', { Text: 'welcome' });
  socket.on('tell name', function (data) {
    console.log(data);
  });
});
