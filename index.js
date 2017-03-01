var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var https = require('https');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Promise = require('bluebird');

var mongoose   = require('mongoose');
var dbcon=process.env.npm_package_config_dbcon;
mongoose.connect(dbcon);

var TaiXe = require('./model/taixe');
var Khach = require('./model/khach');
var LoaiXe = require('./model/loaixe');
var Diem = require('./model/diem');
var LichSu = require('./model/lichsu');

var seeddata = require('./data/seeddata');
seeddata.init();

var api = require('./data/api');

var clients={};
var router = express.Router()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.npm_package_config_port;

router.get('/', function(req, res){
	res.json({ message: 'Welcome to transport map api' });   
});

router.route('/register')
.post(function(req, res){
	var m = req.body;
	
	Khach.findOne({DienThoai: m.DienThoai},function(err,info){
		if(err){
			res.json({
				Error : 1,
				Text : "Có lỗi xảy ra vui lòng thử lại"
			});
		}
		else{
			if(info!=null){
				res.json({
					Error : 1,
					Text : "Khách hàng đã đăng kí thông tin"
				});
			}
			else{
				var k = new Khach({
					HoTen: m.HoTen,
					DienThoai: m.DienThoai,
					DiaChi : m.DiaChi,
					GhiChu: m.GhiChu,
					LoaiXe: m.LoaiXe
				});
				k.save(function(err){
					if(err){
						res.json({
							Error : 1,
							Text : "Có lỗi xảy ra vui lòng thử lại"
						});
					}
					else{
						api.GeoCoding(m,function(data){
							var rs = data;
							var location = rs.Data.results[0].geometry.location;
							var d = new Diem({
								DiaChi: m.DiaChi,
								lat: location.lat,
								lng: location.lng,
								TinhTrang: rs.Error === 1?-1:0
							});
							d.save(function(err){
								if(err){
									res.json({
										Error : 1,
										Text : "Có lỗi xảy ra vui lòng thử lại"
									});
								}
								else{
									var l = new LichSu({
										Khach: k._id,
										Diem: d._id,
										TinhTrang: 0
									});
									l.save(function(err){
										if(err){
											res.json({
												Error : 1,
												Text : "Có lỗi xảy ra vui lòng thử lại"
											});
										}
										else{
											var ls = new LichSu({
												Khach: k._id,
												Diem: d._id,
												TinhTrang: -1
											});
											ls.save(function(err){
												if(err){
													res.json({
														Error : 1,
														Text : "Có lỗi xảy ra vui lòng thử lại"
													});
												}
												else{
													res.json({
														Error : 0,
														Text : "Thêm khách thành công"
													});
													io.emit('reload guest', { Text: 'Có khách mới' });
												}
											});
										}
									});
								}
							});
						});
					}
				});
			}
		}
	});			
});

router.route('/find-taixe')
.post(function(req, res) {
	var m = req.body;
	var des='';
	TaiXe.find({TinhTrang:0,LoaiXe:m.LoaiXe})
	.limit(parseInt(process.env.npm_package_config_limit))
	.exec(
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
					LichSu.findOne({TinhTrang:0})
					.sort( { 'Ngay' : -1 })
					.populate('Diem')
					.populate('Khach')
					.where('Khach.DienThoai').eq(m.DienThoai)
					.exec(function (err, info) {
						if(info != null){
							LichSu.create({Khach:info.Khach._id,Diem:info.Diem._id,TinhTrang:2},function(err){
								if(err){
									console.log(err);
									res.json({
										Error : 1,
										Text : "Có lỗi xảy ra vui lòng thử lại"
									});
								}
								else{
									LichSu.create({Khach:info.Khach._id,Diem:info.Diem._id,TinhTrang:3},function(err){
										if(err){
											console.log(err);
											res.json({
												Error : 1,
												Text : "Có lỗi xảy ra vui lòng thử lại"
											});
										}
										else{
											res.json({
												Error : 1,
												Text : 'Chưa có biker nào'
											});
										}
									});
								}
							});
						}
						else{
							res.json({
								Error : 1,
								Text : 'Điện thoại không tồn tại'
							});
						}
					});
				}
				else {
					LichSu.findOne({TinhTrang:-1})
					.populate('Diem')
					.populate('Khach')
					.where('Khach.DienThoai').eq(m.DienThoai)
					.exec(function (err, ls) {
						if(err){
							console.log(err);
							res.json({
								Error : 1,
								Text : "Có lỗi xảy ra vui lòng thử lại"
							});
						}
						else{
							if(ls != null){
								LichSu.create({Khach:ls.Khach._id,Diem:ls.Diem._id,TinhTrang:2},function(err){
									if(err){
										console.log(err);
										res.json({
											Error : 1,
											Text : "Có lỗi xảy ra vui lòng thử lại"
										});
									}
									else{
										var arr =[];
										infos.forEach(function(info,index){
											des+=info.lat + ','+info.lng+'|';
										});
										des=des.substr(0,des.length);
										api.DistanceMatrix(ls,des,function(rs){
											var data = rs.Data;
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
													io.sockets.connected[s].emit('don khach', {Text: ls.Diem.DiaChi});
													io.sockets.connected[s].on('chap nhan don khach', function(data){
														if(data.TinhTrang === 1){
															resolve(true);
														}
														else{
															reject(false);
														}
													});
												});
												promise.then(
													(value)=>{
														TaiXe.update({ DienThoai: m.DienThoai },{ TinhTrang: 1 },function(err) {
															if (err) {
																res.json({ Error : 1, Text : "Có lỗi xảy ra vui lòng thử lại" });
															}
															else{
																LichSu.create({Khach:ls.Khach._id,Diem:ls.Diem._id,TinhTrang:1},function(err){
																	if(err){
																		console.log(err);
																	}
																	else{
																		res.json({ Error : 0, Text : "Tài xế đang tới" });
																	}
																});
															}
														});
													},
													(error) => {
														if(i < max-1)
															send(i+1,max);
														else
														{
															LichSu.create({Khach:ls.Khach._id,Diem:ls.Diem._id,TinhTrang:3},function(err){
																if(err){
																	console.log(err);
																}
																else{
																	res.json({ Error : 0, Text : "Các tài xế đang bận" });
																}
															});
														}
													}
												);
											}
											send(0,infos.length);		
										});
									}
								});
							}
							else{
								res.json({
									Error : 1,
									Text : 'Điện thoại không tồn tại'
								});
							}
						}
					});
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
					api.GeoCoding(m,function(data){
						var rs = data;
						var location = rs.Data.results[0].geometry.location;
						TaiXe.create({
							HoTen: m.HoTen,
							MatKhau: m.MatKhau,
							DienThoai: m.DienThoai,
							DiaChi : m.DiaChi,
							TinhTrang: -1,
							LoaiXe : m.LoaiXe,
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
					});
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

router.route('/update-taixe')
.post(function(req, res) {
	var m = req.body;
	TaiXe.find({DienThoai:m.DienThoai,MatKhau: m.MatKhau})
	.exec(function (err,info) {
			if (err) {
				console.log(err);
				res.json({
					Error : 1,
					Text : "Có lỗi xảy ra vui lòng thử lại"
				});
			}
			else{
				if(info!=null){
					api.GeoCoding(m,function(data){
						var rs = data;
						var location = rs.Data.results[0].geometry.location;
						TaiXe.update({DienThoai:m.DienThoai,MatKhau: m.MatKhau},{lat:location.lat,lng:location.lng})
						.exec(function(err){
							if(err){
								console.log(err);
								res.json({
									Error : 1,
									Text : "Có lỗi xảy ra vui lòng thử lại"
								});
							}
							else{
								res.json({
									Error : 0,
									Text : "Cập nhật địa chỉ thành công"
								});
							}
						});
					});
				}
				else{
					res.json({
						Error : 1,
						Text : "Tài khoản không đúng"
					});
				}
			}
		}
	);
});

router.route('/guest')
.get(function(req, res) {
	var m = req.body;
	Khach.find({},function(err,infos){
		if(err){
			console.log(err);
		}
		else{
			if(infos.length === 0){
				res.json({
					Error : 1,
					Text : 'Chưa có khách nào'
				});
			}
			else{
				infos.forEach(function(i,index){
					LichSu.findOne({TinhTrang:0,Khach:i._id})
					.sort( { 'Ngay' : -1 })
					.populate('Diem')
					.populate('Khach')
					.exec(function (err, info) {
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
								arr[index] = {
									HoTen : info.Khach.HoTen,
									DienThoai: info.Khach.DienThoai,
									DiaChi : info.Khach.DiaChi,
									GhiChu: info.Khach.GhiChu,
									LoaiXe: info.Khach.LoaiXe,
									TinhTrang: info.TinhTrang,
									location:{
										lat:parseFloat(info.Diem.lat),
										lng:parseFloat(info.Diem.lng)
									}
								};
								res.json({
									Error : 0,
									Data : arr
								});
							}
						}
					});
				});
			}
		}
	});
});

router.route('/history-guest')
.post(function(req, res) {
	var m = req.body;
	console.log(m);
	LichSu.find()
	.populate('Diem')
	.populate({path: 'Khach', model: Khach, select: '-_id DienThoai',match: {DienThoai: {$eq: m.DienThoai}}})
	.where("Khach").ne(null)
	.sort( { 'Ngay' : 1 })
	.exec(function(err,infos){
		if(err){
			console.log(err);
		}
		else{
			console.log(infos);
			if(infos.length === 0){
				res.json({
					Error : 1,
					Text : 'Điện thoại không tồn tại'
				});
			}
			else{
				var arr =[];
				infos.forEach(function(info,index){
					var s;
					switch(info.TinhTrang){
						case -1:
							s='Địa chỉ gốc';
							break;
						case 0:
							s='Đã xác định lại tọa độ';
							break;
						case 1:
							s='Có xe';
							break;
						case 2:
							s='Đang tìm xe';
							break;
						case 3:
						s='Không có xe nhận';
						break;
					}
					arr[index] = {
						DiaChi: info.Diem.DiaChi,
						TinhTrang: s,
						Ngay: info.Ngay
					};
				});
				res.json({
					Error : 0,
					Data : arr
				});
			}
		}
	});
});

router.route('/update-guest')
.post(function(req, res) {
	var m = req.body;
	console.log(m);
	Diem.findOne({lat:m.lat,lng:m.lng})
	.exec(function (err,diem) {
			if (err) {
				console.log(err);
				res.json({
					Error : 1,
					Text : "Có lỗi xảy ra vui lòng thử lại"
				});
			}
			else{
				if(diem!=null){
					Khach.findOne({DienThoai:m.DienThoai},function(err,info){
						if(err){
							console.log(err);
							res.json({
								Error : 1,
								Text : "Có lỗi xảy ra vui lòng thử lại"
							});
						}
						else{
							if(info != null){
								LichSu.create({Diem:diem._id,Khach:info._id,TinhTrang:0},function(err){
									if(err){
										res.json({
											Error : 1,
											Text : "Có lỗi xảy ra vui lòng thử lại"
										});
									}
									else{
										res.json({
											Error : 0,
											Text : "Cập nhật địa chỉ thành công"
										});
										io.emit('reload guest', { Text: 'Cập nhật lại địa chỉ khách' });
									}
								});
							}
						}
					});
				}
				else{
					api.ReverseGeoCoding(m,function(data){
						var rs = data;
						var addr = rs.Data.results[0].formatted_address;
						var d = new Diem({lat:m.lat,lng:m.lng,DiaChi:addr,TinhTrang: 1});
						d.save(function(err){
							if(err){
								console.log(err);
								res.json({
									Error : 1,
									Text : "Có lỗi xảy ra vui lòng thử lại"
								});
							}
							else{
								
								Khach.findOne({DienThoai:m.DienThoai},function(err,info){
									if(err){
										console.log(err);
										res.json({
											Error : 1,
											Text : "Có lỗi xảy ra vui lòng thử lại"
										});
									}
									else{
										if(info != null){
											LichSu.create({Diem:d._id,Khach:info._id,TinhTrang:0},function(err){
												if(err){
													res.json({
														Error : 1,
														Text : "Có lỗi xảy ra vui lòng thử lại"
													});
												}
												else{
													res.json({
														Error : 0,
														Text : "Cập nhật địa chỉ thành công"
													});
													io.emit('reload guest', { Text: 'Cập nhật lại địa chỉ khách' });
												}
											});
										}
									}
								});
							}
						});
					});
				}
			}
		}
	);
});

router.route('/login')
.post(function(req, res) {
	var m = req.body;
	TaiXe.findOne({DienThoai:m.DienThoai,MatKhau:m.MatKhau},
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
	TaiXe.findOne({DienThoai:m.DienThoai,MatKhau: m.MatKhau},
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
