var URL = "http://localhost:9000/";
function DangKy(_name,_pass, _phone, _address,_type) {
    var _url = URL + "api/map/register-taixe";
    var _data = {
		HoTen: _name,
		MatKhau: _pass,
		DienThoai: _phone,
		DiaChi : _address,
		LoaiXe: _type
    };
    var jqxhr = $.ajax({
        url: _url,
        data: JSON.stringify(_data),
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json',
        timeout: 30 * 1000
    })
        .done(function (data, textStatus, jqXHR) {
            console.log(data);
            if (data.Error === 0) {
                alert(data.Text);
            }
            else {
                alert(data.Text);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
}
function DangNhap(_phone,_pass) {
    var _url = URL + "api/map/login";
    var _data = {
		DienThoai: _phone,
		MatKhau: _pass
    };
    var jqxhr = $.ajax({
        url: _url,
        data: JSON.stringify(_data),
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json',
        timeout: 30 * 1000
    })
        .done(function (data, textStatus, jqXHR) {
            console.log(data);
            if (data.Error === 0) {
                alert(data.Text);
				$("#txt_SDT").val(data.Data.DienThoai);
				$("#txt_Ten").val(data.Data.HoTen);
				$("#txt_DiaChi").val(data.Data.DiaChi);
				$("input[name='optradio'][value=" + data.Data.LoaiXe + "]").prop('checked', true);
				loginsend(data.Data.DienThoai);
            }
            else {
                alert(data.Text);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
}
function DangXuat(_phone,_pass) {
    var _url = URL + "api/map/logout";
    var _data = {
		DienThoai: _phone,
		MatKhau: _pass
    };
    var jqxhr = $.ajax({
        url: _url,
        data: JSON.stringify(_data),
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json',
        timeout: 30 * 1000
    })
        .done(function (data, textStatus, jqXHR) {
            console.log(data);
            if (data.Error === 0) {
                alert(data.Text);
				logoutsend(_data.DienThoai);
            }
            else {
                alert(data.Text);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
}
function CapNhat(_phone,_pass, _address) {
    var _url = URL + "api/map/update";
    var _data = {
		DienThoai: _phone,
		MatKhau: _pass,
		DiaChi : _address
    };
    var jqxhr = $.ajax({
        url: _url,
        data: JSON.stringify(_data),
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json',
        timeout: 30 * 1000
    })
        .done(function (data, textStatus, jqXHR) {
            console.log(data);
            if (data.Error === 0) {
                alert(data.Text);
            }
            else {
                alert(data.Text);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
}
$(document).ready(function () {
    $("#btn_DangNhap").click(function () {
        DangNhap($("#txt_SDT").val(),$("#txt_MatKhau").val());
    });
	$("#btn_DangXuat").click(function () {
        DangXuat($("#txt_SDT").val(),$("#txt_MatKhau").val());
    });
	$("#btn_CapNhat").click(function () {
        CapNhat($("#txt_SDT").val(),$("#txt_MatKhau").val(),$("#txt_DiaChi").val());
    });
	$(document).ready(function () {
		$("#btn_DangKy").click(function () {
			DangKy($("#txt_Ten").val(),$("#txt_MatKhau").val(),$("#txt_SDT").val(),$("#txt_DiaChi").val(),$("input[name='optradio']:checked").val());
		});
	});
});