var URL = "http://localhost:9000/";
function DangKy(_name, _phone, _address,_type) {
    var _url = URL + "api/map/register-taixe";
    var _data = {
		HoTen: _name,
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
$(document).ready(function () {
    $("#btn_DangKy").click(function () {
        DangKy($("#txt_Ten").val(),$("#txt_SDT").val(),$("#txt_DiaChi").val(),$("input[name='optradio']:checked").val());
    });
});