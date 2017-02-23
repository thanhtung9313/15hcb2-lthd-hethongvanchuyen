var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var https = require('https');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Promise = require('promise');

var mongoose   = require('mongoose');
var dbcon=process.env.npm_package_config_dbcon;
mongoose.connect(dbcon);

var TaiXe = require('./model/taixe');
var Khach = require('./model/khach');
var LoaiXe = require('./model/loaixe');

var seeddata = require('./data/seeddata');
seeddata.init();

var clients={};
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
	var m = req.body;
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
});

router.route('/find-taixe')
.post(function(req, res) {
	var m = req.body;
	
	var des='';
	TaiXe.find({TinhTrang:0,LoaiXe:m.LoaiXe},
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
						des+=info.lat + ','+info.lng+'|';
					});
					des=des.substr(0,des.length);
					
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
								res.json({ Error : 1, Text : "Có lỗi xảy ra với google map api" });
							}
						});
						response.on('end', function() {
							data = JSON.parse(data);
							if(data.rows.length != 0 && data.rows[0].elements.length != 0){
								
								for(var i = 0;i < infos.length;i++){
									var min = i;
									for(var j=i+1; j <data.rows[0].elements.length-1;j++){
										var a = data.rows[0].elements[min];
										var b = data.rows[0].elements[j];
										if(a.distance.value > b.distance.value) {
											min = j;
										}
									}
									var n = infos[i];
									infos[i] = infos[min];
									infos[min] = n;
									n = data.rows[0].elements[i];
									data.rows[0].elements[i] = data.rows[0].elements[min];
									data.rows[0].elements[min] = n;
								}
								
								var promise;
								var send=function(i,max){
									promise = new Promise (function (resolve, reject) {
										var s=clients[infos[i].DienThoai];
										io.sockets.connected[s].emit('don khach', {Text: m.DiaChi});
										io.sockets.connected[s].on('chap nhan don khach', function(data){
											if(data.TinhTrang === 1){
												resolve(true);
											}
											else{
												reject(false);
											}
										});
									});
									promise.then((value)=>{
										TaiXe.update({ DienThoai: m.DienThoai },{ TinhTrang: 1 },function(err) {
											if (err) {
												console.log(err);
												res.json({
													Error : 1,
													Text : "Có lỗi xảy ra vui lòng thử lại"
												});
											}
											else{
												res.json({ Error : 0, Text : "Tài xế đang tới" });
											}
										});
									},(error) => {
										if(i < max-1)
											send(i+1,max);
										else
											res.json({ Error : 0, Text : "Các tài xế đang bận" });
									});
								}
								console.log(infos.length);
								send(0,infos.length);
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
									LoaiXe : m.LoaiXe,
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
										io.emit('reload tai xe', { Text: 'Có tài xế mới' });
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
							HoTen:info.HoTen,
							DienThoai:info.DienThoai,
							LoaiXe:info.LoaiXe,
							DiaChi:info.DiaChi,
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
							DiaChi : info.DiaChi,
							GhiChu: info.GhiChu,
							LoaiXe: info.LoaiXe,
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

router.route('/login')
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
					TaiXe.update({ DienThoai: m.DienThoai },{ TinhTrang: 0 },function(err) {
						if (err) {
							console.log(err);
							res.json({
								Error : 1,
								Text : "Có lỗi xảy ra vui lòng thử lại"
							});
						}
						else{
							res.json({
								Error : 0,
								Text: 'Đăng nhập thành công',
								Data : info
							});
						}
					});
				}
				else {
					res.json({
						Error : 1,
						Text : "Số điện thoại không tồn tại"
					});
				}
			}
		}
	);
});

router.route('/logout')
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
					TaiXe.update({ DienThoai: m.DienThoai },{ TinhTrang: -1 },function(err) {
						if (err) {
							console.log(err);
							res.json({
								Error : 1,
								Text : "Có lỗi xảy ra vui lòng thử lại"
							});
						}
						else{
							io.of('/'+info.DienThoai).on('connection',function(socket){
								socket.emit('disconnect', {});
							});
							res.json({
								Error : 0,
								Text : 'Đăng xuất thành công'
							});
						}
					});
				}
				else {
					res.json({
						Error : 1,
						Text : "Số điện thoại không tồn tại"
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
  socket.on('login',function(data){
		clients[data.DienThoai] = socket.id;
		console.log(clients);
	});
	socket.on('logout',function(data){
		delete clients[data.DienThoai];
		console.log(clients);
	});
});
