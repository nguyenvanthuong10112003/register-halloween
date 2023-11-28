var selectTinh = $("#tinh-tp");
var selectHuyen = $("#quan-huyen");
var selectXa = $("#phuong-xa");
var nutToiTrangDangKy = $('#toDangKy')
var nutDangKy = $('.btn-register-submit')
var errorTen = $('#errorFullName')
var errorGender = $('#errorGender')
var errorDate = $('#errorDateOfBirth')
var errorAddress = $('#errorDiaChi')
var errorPhone = $('#errorPhoneNumber')
var error = $('error')
var inputHoVaTen = $('#input-full-name')
var inputGenderNam = $('#gender-nam')
var inputGenderNu = $('#gender-nu')
var inputDateOfBirth = $('#input-date-of-birth')
var inputAddress = $('.input-disabled-address')
var inputPhone = $('#input-phone-number')
var dataName = ["HoVaTen", "GioiTinh", "NgaySinh", "Address", "SoDienThoai"]
var url = 'https://script.google.com/macros/s/AKfycbxdgfwbkSDVxcU88BwlHokcO0UahaDGUOXCcc4Wmkb1dKyTSvfqW5xq-Z1EMCkVV6DdpA/exec'
var open = false;
$(document).ready(function () {
  nutToiTrangDangKy.click(function () {
    let href = window.location.pathname.split('/')
    window.location = window.location.origin + href.reduce((result, item, index) => {
      if (index == href.length - 1)
        return result
      return result + "/" + item;
    }, '') + "/dang-ky.html"
  })
  selectTinh.change(function () {
    var idName = selectTinh.val();
    if (idName > 0) {
      loadData(
        selectHuyen,
        "huyện",
        "province_code",
        "https://provinces.open-api.vn/api/d/",
        idName
      );
    }
  });
  selectHuyen.change(function () {
    var idName = selectHuyen.val();
    if (idName > 0) {
      loadData(
        selectXa,
        "xã",
        "district_code",
        "https://provinces.open-api.vn/api/w/",
        idName
      );
    }
  });
  $('#form-register').change(function (e) {
    e = $(e.target)
    if (e.attr('id') == selectTinh.attr('id') || 
        e.attr('id') == selectHuyen.attr('id') || 
        e.attr('id') == selectXa.attr('id') || 
        e.attr('id') == $('#dia-chi-cu-the').attr('id')) {
        let tinh;
        let huyen;
        let xa;
        if (selectTinh.val() != selectTinh.children()[0].innerText) {
          tinh = selectTinh.children()
          for (let item of tinh) 
          {
            if ($(item).val() == selectTinh.val()) {
              tinh = $(item).text()
              break;
            }
          }
        }
        if (selectHuyen.val() != selectHuyen.children()[0].innerText) {
          huyen = selectHuyen.children()
          for (let item of huyen) 
          {
            if ($(item).val() == selectHuyen.val()) {
              huyen = $(item).text()
              break
            }
          }
        }
        if (selectXa.val() != selectXa.children()[0].innerText) {
          xa = selectXa.children()
          for (let item of xa) 
          {
            if ($(item).val() == selectXa.val()) {
              xa = $(item).text()
              break
            }
          }
        }
      $('.input-disabled-address').val(
        ($('#dia-chi-cu-the').val() ? $('#dia-chi-cu-the').val() + ' - ' : '') +
        (xa ? xa.trim() + ' - ' : '') + 
        (huyen ? huyen.trim() + ' - ' : '') +
        (tinh ? tinh.trim() : '')
      )
    }
  })
  $('.cancel').click(function (){
    let href = window.location.pathname.split('/')
    window.location = window.location.origin + href.reduce((result, item, index) => {
      if (index == href.length - 1)
        return result
      return result + "/" + item;
    }, '') + "/index.html"
  })
  nutDangKy.click(function () {
    let can = true;
    let HoVaTen = inputHoVaTen.val() ? inputHoVaTen.val().trim() : undefined
    let GioiTinh = inputGenderNam.prop('checked') ? 'Nam' : (inputGenderNu.prop('checked') ? 'Nữ' : undefined)
    let NgaySinh = inputDateOfBirth.val() ? inputDateOfBirth.val() : undefined
    let DiaChi = inputAddress.val() ? inputAddress.val().trim() : undefined
    let SoDienThoai = inputPhone.val() ? inputPhone.val().trim() : undefined
    errorTen.text('')
    errorGender.text('')
    errorDate.text('')
    errorAddress.text('')
    errorPhone.text('')
    error.text('')
    if (HoVaTen == undefined || HoVaTen.length == 0) {
      errorTen.text('Trường này không được để trống')
      can = false;
    }
    if (GioiTinh == undefined) {
      errorGender.text('Trường này không được để trống')
      can = false;
    }
    if (NgaySinh == undefined) {
      errorDate.text('Trường này không được để trống')
      can = false;
    }
    if (DiaChi == undefined || DiaChi.length == 0) {
      errorAddress.text('Trường này không được để trống')
      can = false;
    }
    if (SoDienThoai == undefined || SoDienThoai.length == 0) {
      errorPhone.text('Trường này không được để trống')
      can = false;
    }
    if (SoDienThoai && (SoDienThoai.length != 10 || SoDienThoai.split('').some((item) => item > '9' || item < '0'))) {
      errorPhone.text('Số điện thoại phải có đủ 10 ký tự số')
      can = false;
    }
    if (can) {
      NgaySinh = NgaySinh.substr(8, 2) + '-' + NgaySinh.substr(5, 2) + '-' + NgaySinh.substr(0, 4)
      console.log(NgaySinh)
      let obj = {}
      obj[dataName[0]] = HoVaTen
      obj[dataName[1]] = GioiTinh
      obj[dataName[2]] = NgaySinh
      obj[dataName[3]] = DiaChi
      obj[dataName[4]] = SoDienThoai
      addData(obj)
    }
  })
});
var loadData = function (element, name, doiChieu, url, idName) {
  $.ajax({
    url: url,
    type: "GET",
    data: "",
    dataType: "json",
    success: function (data) {
      let success = false;
      let html = `<option>-Chọn ${name}-</option>`;
      for (let item of data) {
        if (item[doiChieu] == idName || (doiChieu == null && idName == null)) {
          success = true;
          html += `
                    <option id="${change_alias(name)}-${item["codename"]}" 
                    value="${item["code"]}">${item["name"]}
                    </option>
                    `;
          continue;
        }
        if (success) break;
      }
      element.html(html);
    },
    error: function (message) {
      alert("error");
      console.log(message);
    },
  });
};
function change_alias(alias) {
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  str = str.replace(/ + /g, " ");
  str = str.trim();
  return str;
}
loadData(
  selectTinh,
  "tỉnh",
  null,
  "https://provinces.open-api.vn/api/?depth=1",
  null
);
var addData = function (data) {
  if (data) {
    $.ajax({
      url: url, 
      dataType: 'json',
      data: data,
      success: function (data) {
          let href = window.location.pathname.split('/')
          window.location = window.location.origin + href.reduce((result, item, index) => {
            if (index == href.length - 1)
              return result
            return result + "/" + item;
          }, '') + "/success.html"
      },
      error: function () {
        alert("T.T Có lỗi xảy ra rùi, vui lòng thử lại sau nhé ...")
      }
    })
  }
}
