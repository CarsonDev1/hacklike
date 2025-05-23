var userInputUID = false,
  paymentTimeOut = 45,
  // Stand for selected discount
  sDiscount = null;

const multiOrderData = {
  running: false,
  uidElementSelector: '#formUserAction [name=uid], #formUserAction [name=link], #formUserAction #url.form-control',
  customQuantitySelector: '#multi-order-custom-quantity',
  countSelector: '#count, #vip_package, [name="vip_package"], [name="count"]',
  purchaseData: [],
  requestStop: false,
  idMap: {},
  orderSubTotal: 0,
  elementType: '',
}

$(document).ready(function(){
  if ($('body').hasClass('test-mode')) {
    Swal.fire({
      title: 'Để sử dụng dịch vụ bạn cần đăng ký/ đăng nhập tài khoản cho riêng bạn, tài khoản xem thử này không thể mua!',
      icon: 'warning',
      html: '',
      allowOutsideClick: true,
      showCancelButton: true,
      confirmButtonText: 'Tiếp tục xem',
      cancelButtonText: 'Đăng xuất'
    }).then(function(data) {
      if (data && data.isDismissed) {
        $.get('/logout').done(function() {
          window.location.href = '/';
        });
      }
    })
  }

  $('#user_input_uid').click(function() {
    userInputUID = !userInputUID;
    $(this).html(userInputUID ? 'Nhập info tự động' : 'Nhập info thủ công');
    toastr.success("Đã chuyển qua chế độ: " + (userInputUID ? 'Nhập info thủ công' : 'Nhập info tự động'));
    if (!userInputUID) $('#link').trigger('change');
  });

  $('.toggle-sidebar-mobile').click(function() {
    $('#kt_aside_mobile_toggler').trigger('click');
  });

  // Check and show modalNotifyByType
  try {
    if ($('#modalNotifyByType').length) {
      if (typeof type === 'undefined') type = 'common';

      $('.btn-hide-type-popup').click(function() {
        $.cookie('popup_' + type, + new Date());
      });

      var matchCookie = $.cookie('popup_' + type);
      if (!matchCookie || moment().diff(moment(Number(matchCookie)), 'hour') >= 5) {
        $('#modalNotifyByType').modal('show');
      }
    }
  } catch (e) {
    console.error('modalNotifyByType:', e);
  }

  $("#service-select").val(window.location.pathname).select2({
    placeholder: "Chọn dịch vụ",
    allowClear: true,
    "language": {
      "noResults": function(){
        return "Không có kết quả, liên hệ admin nếu cần bổ sung dịch vụ";
      }
    },
  }).on('select2:select', function () {
    window.location.href =  $('#service-select').val();
  });
});

$("#formUserAction").submit(async function (e) {
  e.preventDefault();
});

function renderText(text) {
  return ejs.render('<%= text %>', {text})
}

$('input').on('paste', function () {
  var that = this;
  setTimeout(function () {
    $(that).blur();
  }, 10);
});

function applyDiscountAndCurrency(total) {
  $('#discount-status').attr('class', '');

  total = vndToCurrentCurrency(total);

  if (!sDiscount) return total;
  const minOrder = vndToCurrentCurrency(sDiscount.min_order);

  if (total < minOrder) {
    $('#discount-status').addClass('text-danger').html(`Vui lòng tạo đơn tối thiểu 
        <span>${formatMoney(minOrder, 'd')}</span> để sử dụng mã giảm giá này!`);
    return total;
  }

  var willDiscount = round(total * (sDiscount.discount_percent / 100), 5);
  if (currency == 'vnd') willDiscount = Math.floor(willDiscount);

  const maxDiscount = vndToCurrentCurrency(sDiscount.max_discount);
  if (willDiscount > maxDiscount) willDiscount = maxDiscount;

  $('#discount-status').addClass('text-success').html(`Mã giảm giá đã được áp dụng! `+
    `Bạn được giảm <span>${formatMoney(willDiscount, 'd', currency === 'vnd')}</span>`);

  console.log(`Apply discount: ${total} - ${willDiscount} = ${total - willDiscount}`);
  return total - willDiscount;
}


// Handle for services in view
$('#services').change(function() {
  // Update price
  let selectedPrice = $(this).children("option:selected").data('price');
  $('#price').val(selectedPrice);
  // Trigger change
  $('#count').trigger('change');
});

$('#price').keyup(function () {
  $('#count').trigger('change');
});

$('#price').change(function () {
  $('#count').trigger('change');
});

$('.btn-view-history').click(function() {
  var target = $(this).data('target');
  $('a.nav-link[href="' +target+ '"]').trigger('click');
  $([document.documentElement, document.body]).animate({
    scrollTop: $(target).offset().top - 100
  }, 500);
});

$('.has_count').keyup(function() {
  $($(this).data('counter')).html(countLine($(this).val()));
});

$('[name="list_comment"], [name="comment"], [name=comments]').change(function() {
  $(this).val(getContentArray($(this).val()).join("\n"));
});


const USD_RATE = 24_000;
const BATH_RATE = 739;

const vndToCurrentCurrency = (value, formatText = false, target = null) => {
  if (typeof value !== 'number') value = Number(value.toString().replace(/,/g, ''));

  if (currency == 'vnd' && !target) {
    if (!formatText) return value;
    return formatMoney(value, '', false);
  }

  let rate = USD_RATE;
  let places = 5;

  if ((currency == 'baht' && !target) || target == 'baht') {
    rate = BATH_RATE;
    places = 4;
  }

  value = round(value / rate, places);
  if (!formatText) return value;
  return formatMoney(value, '', false);
}

const currencyMap = {
  vnd: formatMoney(userBalance),
  usd: vndToCurrentCurrency(userBalance, true,  'usd'),
  baht: vndToCurrentCurrency(userBalance, true, 'baht'),
}
const currencyCharsMap = {
  vnd: '₫',
  usd: '$',
  baht: '฿'
}

$('.currency-select').each(function() {
  const that = this;
  Object.keys(currencyMap).forEach(item => {
    $(that).append(`<option value="${item}">${currencyMap[item]} ${currencyCharsMap[item]}</option>`);
  })
})
    .val(currency)
    .change(function() {
      currency = $(this).val();
      changeCurrency();

      $('.currency-dropdown .dropdown-toggle').dropdown('toggle');

      const activeServer = $('.radio.radio-server:not(.pause,.stopped) input[name="server"]');
      if (activeServer.length) {
        activeServer.first().trigger('change');
      } else {
        $('#count').trigger('change');
      }
    });

// Change currency (text only)
function changeCurrency() {
  console.log('changeCurrency')
  $('.money-value').each(function() {
    // Temp
    $(this).attr('data-currency', 'vi');

    if (!$(this).attr('data-original')) $(this).attr('data-original', $(this).text());
    // ignore if translated

    if ($(this).attr('data-currency') == currency) return;
    // if vnd
    if (currency === 'vnd' && !$(this).attr('data-currency')) return;

    const vndValue = $(this).attr('data-original').toString().replace(/,/g, '');

    $(this).text(vndToCurrentCurrency(Number(vndValue), true));

    $(this).attr('data-currency', currency);
  });
  $('.currency-unit').text(currencyCharsMap[currency]);
}

if (currency !== 'vnd') changeCurrency();

$('.currency-dropdown .dropdown-menu *').click(function(e) {
  e.stopPropagation();
});


