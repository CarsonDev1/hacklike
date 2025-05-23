var filter = { status: 'all', server: 'all', cookie_live: 'all', filter: 'all'};
var ckElements = {},
    orderStatus = {
      processing: -1,
      running: 0,
      done: 1,
      admin_cancelled: 2,
      refunded: 3,
      waiting_cancel: 4,
      need_check: 10
    }

function ckEditor(elementId) {
  if (typeof CKEDITOR === "undefined") return console.error('CKEDITOR not loaded!');

  CKEDITOR.replace( elementId, {
    language: 'vi',
    removePlugins:'about,save,exportpdf,print,a11yhelp,filebrowser,pastefromgdocs,pastefromlibreoffice,pastefromword,' +
      'uploadimage,templates,editorplaceholder,forms,iframe,smiley,language,scayt,div'
  } );
}

function updateSingleEditor(elementId, content) {
  CKEDITOR.instances[elementId].setData(content);
}

function updateEditor() {
  // Update ckeditor v4
  if (typeof CKEDITOR !== "undefined" && Object.keys(CKEDITOR.instances).length > 0) {
    Object.keys(CKEDITOR.instances).forEach(function(key) {
      CKEDITOR.instances[key].updateElement();
    });
  }

  // Update ckeditor v5
  if (Object.values(ckElements).length) {
    Object.values(ckElements).forEach(function(editor) {
      editor.updateSourceElement();
    })
  }
}

var momentFormat = {
  full: 'HH:mm:ss DD/MM/YYYY',
  full_reverse: 'YYYY/MM/DD HH:mm:ss',
  date: 'DD/MM/YYYY',
  date_hyphen: 'DD-MM-YYYY',
  date_hyphen_reserve: 'YYYY-MM-DD',
  datetime_picker: 'YYYY-MM-DD HH:mm:ss',
};

// Active current item
var mPath = window.location.pathname;
if (mPath.substring(mPath.length - 1) == '/') mPath = mPath.substring(0, mPath.length  - 1);
if (mPath == '') mPath = '/';
if (mPath.match(/\/users\/subtract_balance\/(\d+)/)) mPath = mPath.replace(/subtract_balance\/\d+$/, "subtract_balance")
if (mPath.match(/\/users\/make_payment\/(\d+)/)) mPath = mPath.replace(/make_payment\/\d+$/, "make_payment")
if (mPath.match(/\/tickets\/view/)) mPath = mPath.replace(/tickets\/.*/, "tickets")

var links = $(`#kt_aside_menu_wrapper a[href="${mPath}"]`);
if (!links.length) links = $(`#kt_aside_menu_wrapper a[href="${mPath.substr(0, mPath.length - 1)}"]`);

links.each(function() {
  const link = $(this);

  link.find('.kt-menu__link-text').addClass('text-bold');
  var elm = link;
  for (var i = 0; i < 10; i++) {
    elm = $(elm).parent();

    if (elm.hasClass('kt-menu__nav')) break;

    if (elm.hasClass('kt-menu__item')) {
      elm.addClass('kt-menu__item--active kt-menu__item--open');
    }

    if (elm.hasClass('kt-menu__item--submenu'))
      elm.find('a:first-child').first().find('.kt-menu__link-text').addClass('text-bold');

    const windowHeight = $(window).height();
    if ($(link).offset().top > windowHeight / 2.2) {
      $('#kt_aside_menu').animate({
        scrollTop: $(link).offset().top - windowHeight / 2.2
      }, 100);
    }
  }
})

toastr.options = {
  "closeButton": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "500",
  "hideDuration": "1500",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

function showToolTip() { $('[data-toggle="tooltip"], .btn-icon').tooltip(); }

if ($.fn.dataTable)
  $.extend( $.fn.dataTable.defaults, {
    fnDrawCallback: function() {
      showToolTip();
      if (typeof datatableLoaded === "function") datatableLoaded();
      if ($('.note-editable').length) $('.note-editable').parent().addClass('note-edit-wrapper');
      if (!$('.doubleScroll-scroll-wrapper').length) $('table.dataTable').parent().doubleScroll();
      if (typeof changeCurrency == "function") changeCurrency();
    },
    "language": {
      "sProcessing":   "Đang xử lý...",
      "sLengthMenu":   "Xem _MENU_ mục",
      "emptyTable":  "Không tìm thấy dòng nào phù hợp",
      "sZeroRecords":  "Không tìm thấy dòng nào phù hợp",
      "sInfo":         "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ mục",
      "sInfoEmpty":    "Đang xem 0 đến 0 trong tổng số 0 mục",
      "sInfoFiltered": "(được lọc từ _MAX_ mục)",
      "sInfoPostFix":  "",
      "sSearch":       "Tìm:",
      "sUrl":          "",
      "oPaginate": {
        "sFirst":    "Đầu",
        "sPrevious": "Trước",
        "sNext":     "Tiếp",
        "sLast":     "Cuối"
      }
    }
  });

$(document).on('click', '.note-editable', function() {
  if ($(this).hasClass('editing')) return;

  // If another note is editing
  if ($('.note-editable.editing').length) $('.note-editable.editing textarea').trigger('blur');

  $('.note-editable').removeClass('editing');
  var content = $(this).text();
  $(this).addClass('editing').html(`<textarea class="form-control" rows="4"></textarea>`);
  $(this).find('textarea').focus().val(content);
});

var definedColumns = {
  stt: makeColumn('STT', 'id'),
  type: makeColumn('Loại', 'type'),
  uid: makeColumn('Uid', 'uid'),
  link: makeColumn('Link', 'uid'),
  uid_with_action: makeColumn('Uid', 'uid', (uid, t, order) => {
    var copyUid = !order.order_id || (order.order_id && ['0', 0, true].includes(order.order_id));
    if (typeof baseUrl !== "undefined" && baseUrl == '') copyUid = true;
    if (order && order.type === 'lucky_wheel') return components.table.uid(uid, t, order);

    return `<div style="min-width: 150px">
                <span class="copy-on-click text-success" data-title="Sao chép ${copyUid ? 'UID' : 'Id đơn'}"
                    data-toggle="tooltip" data-content="${order[copyUid ? 'uid' : 'order_id']}">
                    <i class="fa-regular fa-clipboard"></i>
                </span>
                ${components.table.uid(uid, t, order)}
            </div>`;
  }),
  name: makeColumn('Name', 'name', (name, t, full) => {
    var icon = '';
    if (full.type && full.uid && full.type.match(/vip|bot/) && !full.type.match(/instagram|tiktok|twitter/))
      icon = `<img src="https://graph.facebook.com/${full.uid}/picture?height=100&width=100&access_token=2712477385668128|b429aeb53369951d411e1cae8e810640" alt="">`;

    return `<div class="name-container">${icon} ${name || ''}</div>`;
  }),
  note: makeColumn('Ghi chú', 'note'),
  note_editable: makeColumn('Ghi chú', 'note', function(note, t, order) {
    return ejs.render(`<div class="note-editable" data-id="<%= order.id %>" data-type="<%= order.type %>"><%= note %></div>`, {order, note});
  }),
  staff_note_editable: makeColumn('Ghi chú Nhân viên', 'data', function(data, t, order) {
    return ejs.render(`<div class="note-editable" data-target="staff" data-id="<%= order.id %>"><%= data.staff_note %></div>`, {order, data});
  }),

  admin_note_editable: makeColumn('Admin Note', 'admin_note', function(data, t, order) {
    return ejs.render(`<div class="note-editable" data-target="admin_note" data-id="<%= order.id %>"><%= order.admin_note %></div>`, {order, data});
  }),

  admin_note: makeColumn('Admin Note', 'admin_note'),
  server: makeColumn('Server', 'server'),
  msg: makeColumn('Nội dung', 'msg', 'content'),
  price: makeColumn('Số Tiền', 'price', 'price'),
  count: makeColumn('Số lượng', 'count'),
  like_count: makeColumn('Số Like', 'like_count'),
  sold_price: makeColumn('Giá bán', 'sold_price', 'money_vnd'),
  original: makeColumn('Bắt đầu', 'original'),
  present: makeColumn((typeof type === 'undefined' || type !== 'buff_group') ? 'Đã chạy' : 'Hiện tại', 'present'),
  price_only: makeColumn('Số Tiền', 'price', function(data) {
    return `<button class="btn btn-primary money-value">${formatMoney(data)}</button>`;
  }),
  duration: makeColumn('Thời Hạn', 'duration'),
  package: makeColumn('Gói', 'package'),
  time: makeColumn('Thời Gian', 'time'),
  time_expired: makeColumn('Ngày Hết Hạn', 'time_expired', 'time_expired'),
  proxy_name: makeColumn('Proxy', 'proxy_name'),
  proxy_expired_at: makeColumn('Hạn Sd proxy', 'proxy_expired_at', 'time_expired', true),
  black_list_keyword: makeColumn('Black List Từ Khóa', 'other', function(data) {
    return data.black_list_keyword ? '<span class="text-success text-bold">Có</span>' : '';
  }, true),
  live_flg: makeColumn('Trạng thái Cookie', 'live_flg', function(data) {
    if (data) return `<button class="btn btn-success">Live</button>`;
    return `<button class="btn btn-danger">Die</button>`;
  }),
  blocked_o: makeColumn('Blocked', 'other', function(data) {
    if (data.blocked) return `<button class="btn btn-danger">Blocked</button>`;
    return `<button class="btn btn-success">Không</button>`;
  }, true),
  toggle_o: makeColumn('ON/OFF', 'other', function(data, typeT, full) {
    return ejs.render('<input type="checkbox" value="" class="btn-toggle-running" data-order_id="<%= full.order_id %>" <%= data.is_running ? "checked" : "" %> />', {full, data});
  }, true),
  status: makeColumn('Trạng thái', 'status', 'status'),
  vip_status: makeColumn('Trạng thái', 'status', 'vip_status'),
  comment_data: makeColumn('Nội dung', 'data', 'comment', true),
  description_data: makeColumn('Mô tả', 'data', data => {
    let json = readJson(data);
    return components.table.text_danger(json.description || '');
  }, true),
  comment_other: makeColumn('Comment', 'other', 'click_to_view', true),
  changed_money: makeColumn('Số Tiền thay đổi', 'price', 'changed_money'),
  payment_mode: makeColumn('Hình thức', 'is_auto', 'payment_mode'),
  max_post: makeColumn('Số bài tối đa', 'max_post'),
  refund_amount: makeColumn('Số tiền hoàn', 'refund_amount', function(data, typeT, full) {
    return `<span class="kt-badge kt-badge--success kt-badge--inline money-value">${formatMoney(full.money_before)}</span> 
                        <span>+</span> 
                        <span class="kt-badge kt-badge--danger kt-badge--inline money-value">${formatMoney(full.refund_amount)}</span> 
                        <span>=</span> 
                        <span class="kt-badge kt-badge--primary kt-badge--inline money-value">${formatMoney(full.money_before + full.refund_amount)}</span>`;
  }),
  refund_count: makeColumn('Số lượng hoàn', 'refund_count'),
  created_at: makeColumn('Thời gian', 'createdAt', 'time'),
  post_today: makeColumn('Đã tăng hôm nay', 'post_today', function(value, t, vip) {
    if (vip.type === 'vip_like' && vip.server === 'server_6') return ' ';
    return `<span class="text-danger text-bold">${value}</span>`;
  }),
  total_post: makeColumn('Số bài đã chạy', 'post_today', function(value) {
    return `<span class="text-danger text-bold">${value}</span>`;
  }),
  notify_type: makeColumn('Loại', 'type', nType => {
    if (typeof nMap == "undefined") return 'NULL';
    return nMap[nType] || nMap.notify;
  }),
  notify_content: makeColumn('Nội dung', 'content', components.table.text_primary),
  notify_image: makeColumn('Hình ảnh', 'image', image => {
    return ejs.render("<img class='table-image' src='<%= image %>' alt='' />", {image});
  }),
  tf_status: makeColumn('Trạng thái', 'status', function(status) {
    if (status == 0) return components.badge_danger('Đang dừng');
    return components.badge_success('Đang chạy');
  }),

  card_type: makeColumn('Loại thẻ', 'card_type', cardType => {
    var mapping = {
      VTT:'Viettel',
      VNP:'Vinaphone',
      VMS:'Mobifone',
      ZING:'Zing',
      GATE:'Gate',
      VCOIN:'Vcoin'
    };
    return `<button class="btn btn-primary text-bold">${mapping[cardType]}</button>`;
  }),
  card_serial: makeColumn('Seri thẻ cào', 'card_serial'),
  card_code: makeColumn('Mã thẻ cào', 'card_code'),
  card_value: makeColumn('Mệnh giá', 'card_value'),
  card_status: makeColumn('Trạng thái', 'status', status => {
    var allClass = ['primary', 'success', 'danger'];
    var allText = ['Đang xử lý', 'Thành công', 'Thất bại'];
    return `<span class="text-bold text-${allClass[status]}">${allText[status]}</span>`;
  }),

  page_info: makeColumn('Thông tin', 'uid', function(uid, t, page) {
    return `
      <a class="text-bold" target="_blank" href="https://fb.com/${page.uid}">
        <span class="text-primary">${page.name}</span> - <span class="text-success">${page.uid}</span>
      </a>
    `
  }),
  admin_facebook: makeColumn('Admin Facebook', 'admin_facebook'),
  contact_info: makeColumn('Thông tin liên hệ', 'contact_info'),
  new_name: makeColumn('Tên mới', 'new_name'),
  page_price: makeColumn('Số Tiền', 'price', 'money_vnd'),
  sold_at: makeColumn('Thời gian', 'sold_at', 'time'),
  warranty_count: makeColumn('Số lượng bảo hành', 'warranty_count'),
  warranty_status: makeColumn('Trạng thái', 'status', function(status) {
    var allStatus = ['Chờ duyệt', 'Đang chạy', 'Đã xong'];
    var allBtn = ['btn-danger', 'btn-primary', 'btn-warning text-white'];
    return `<button class="btn ${allBtn[status]}">${allStatus[status] || allStatus[0]}</button>`
  }),
  phone: makeColumn('Số Điện Thoại', 'phone', 'text_primary'),
  source_username: makeColumn('User nạp', 'source_username', 'text_danger'),
  amount: makeColumn('Số tiền nạp', 'amount', 'price_only'),
  commission: makeColumn('Tiền hoa hồng', 'commission', 'price_only'),
  commission_value: makeColumn('Số Tiền', 'amount', 'price'),
  vip_live_post: makeColumn('Đã tăng', 'post_today', function(value, t, row) {
    if (!row.max_post || row.type !== 'vip_live') return ' ';
    return components.table.text_primary(row.post_today) + '/' + components.table.text_success(row.max_post);
  }),

  action: function (render) {
    return makeColumn('Hành Động', 'id', render, true);
  },
  map_name: makeColumn('Tên maps', 'data', data => readJsonData(data, 'map_name')),
  map_image: makeColumn('Hình ảnh', 'data', data => {
    var map_image = readJsonData(data, 'map_image');
    if (!map_image) return ' ';
    return ejs.render('<a href="<%= map_image %>" target="_blank">Xem</a>', {map_image})
  }),
  map_address: makeColumn('Địa chỉ', 'data', data => readJsonData(data, 'map_address')),
  map_phone: makeColumn('SDT ghim', 'data', data => readJsonData(data, 'map_phone')),
  map_website: makeColumn('Website/Fanpage', 'data', data => readJsonData(data, 'map_website')),
  contact_phone: makeColumn('SDT liên hệ', 'data', data => {
    const value = readJsonData(data, 'contact_phone');
    if (!(value && value.toString().trim())) return '';

    return `<div>
                <span class="copy-on-click text-success" data-title="Sao chép"
                    data-toggle="tooltip" data-content="${value}">
                    <i class="fa-regular fa-clipboard"></i>
                </span>
                ${components.table.text_primary(value)}
            </div>`;
  }),
  map_note: makeColumn('Ghi chú thêm', 'data', data => readJsonData(data, 'map_note')),
  payment_status: makeColumn('Trạng thái thanh toán', 'payment_status', payment_status => {
    payment_status = Number(payment_status);
    if (payment_status) return components.table.text_success('Đã thanh toán');
    return components.table.text_danger('Cần thanh toán thêm');
  }),
  service_order_total: makeColumn('Giá', 'total', (total, t, order) => {
    let text = components.table.text_danger(formatMoney(total));
    if (order.data && order.data.request_amount)
      text += components.table.text_success(` (+${formatMoney(order.data.request_amount)})`);

    return text;
  }),
  nameservers: makeColumn('Nameservers yêu cầu', 'data', data => {
    let json = readJson(data);
    if (!(json && json.nameservers && json.nameservers.length)) return ' ';

    return `<span class="text-danger text-bold">${json.nameservers.join("<br />")}</span>`;
  }),
  domain_admin_note: makeColumn('Ghi chú Admin', 'data', data => {
    let json = readJson(data);
    return components.table.text_danger(json && json.admin_note ? json.admin_note : '');
  }),
  bank_voucher: makeColumn('Mã', 'data', data => {
    let json = readJson(data);
    if (!json.purchased_code.length) return '';
    return components.click_to_view(json.purchased_code.join("\n"));
  }),
  payment_content: makeColumn('Nội dung CK', 'payment_content', 'text_primary'),
};

function readJsonData(data, key) {
  var json = readJson(data);
  if (!json[key]) return ' ';
  return ejs.render('<%= text %>', {text: json[key]});
}

$("#formRedirect").submit(function(e) {
  e.preventDefault();

  $.ajax({
    type: "POST",
    url: $(this).attr("action"),
    data: $(this).serialize(),
    success: async function (data) {
      if (data.status !== 1) return swalError(data.msg);

      await swalSuccess(data.msg);
      window.location.assign(data.redirect);
    }
  });
});

$(document).ready(function() {
  if ($('.tab-status').length) {
    getOrderSummary();
  }

  $(".form-json").submit(function(e) {
    e.preventDefault();
  });

  $('.nav-link[data-toggle="tab"][role="tab"]').click(function() {
    setTimeout(function() {
      $('table.dataTable').parent().doubleScroll();
    }, 500);
  });

  setTimeout(function() {
    $('table.dataTable').parent().doubleScroll();
  }, 500);

  if ($(window).width() <= 768) $('body').addClass('mobile');

  $('[data-toggle="tooltip"], .btn-icon').tooltip();

  // Set locale for moment
  if (typeof moment !== 'undefined' && typeof $().datetimepicker !== 'undefined') {
    moment.defineLocale('vi', {
      months: 'Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12'.split(
        '_'
      ),
      monthsShort: 'Thg 01_Thg 02_Thg 03_Thg 04_Thg 05_Thg 06_Thg 07_Thg 08_Thg 09_Thg 10_Thg 11_Thg 12'.split(
        '_'
      ),
      monthsParseExact: true,
      weekdays: 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split(
        '_'
      ),
      weekdaysShort: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
      weekdaysMin: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
      weekdaysParseExact: true,
      meridiemParse: /sa|ch/i,
      isPM: function (input) {
        return /^ch$/i.test(input);
      },
      meridiem: function (hours, minutes, isLower) {
        if (hours < 12) {
          return isLower ? 'sa' : 'SA';
        } else {
          return isLower ? 'ch' : 'CH';
        }
      },
      longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM [năm] YYYY',
        LLL: 'D MMMM [năm] YYYY HH:mm',
        LLLL: 'dddd, D MMMM [năm] YYYY HH:mm',
        l: 'DD/M/YYYY',
        ll: 'D MMM YYYY',
        lll: 'D MMM YYYY HH:mm',
        llll: 'ddd, D MMM YYYY HH:mm',
      },
      calendar: {
        sameDay: '[Hôm nay lúc] LT',
        nextDay: '[Ngày mai lúc] LT',
        nextWeek: 'dddd [tuần tới lúc] LT',
        lastDay: '[Hôm qua lúc] LT',
        lastWeek: 'dddd [tuần trước lúc] LT',
        sameElse: 'L',
      },
      relativeTime: {
        future: '%s tới',
        past: '%s trước',
        s: 'vài giây',
        ss: '%d giây',
        m: 'một phút',
        mm: '%d phút',
        h: 'một giờ',
        hh: '%d giờ',
        d: 'một ngày',
        dd: '%d ngày',
        w: 'một tuần',
        ww: '%d tuần',
        M: 'một tháng',
        MM: '%d tháng',
        y: 'một năm',
        yy: '%d năm',
      },
      dayOfMonthOrdinalParse: /\d{1,2}/,
      ordinal: function (number) {
        return number;
      },
      week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4, // The week that contains Jan 4th is the first week of the year.
      },
    });
  }
});

$('input[name="reaction_on"]').change(function() {
  var willShow = $(this).is(':checked');
  $(this).closest('form').find('.area-reaction')[willShow ? 'show' : 'hide'](500);
});

$('input[name="comment_on"]').change(function() {
  var checked = $(this).is(':checked');
  var areaComment = $(this).closest('form').find('.area-comment');
  if (!areaComment.length) return;
  areaComment[checked ? 'show' : 'hide'](500);
  areaComment.find('textarea[name="comments"]').prop('required', checked);
  areaComment.find('input[name="max_comment"]').prop('required', checked);
});

$('.comment-content-wrapper .badge').click(function() {
  var appendText;
  if ($(this).hasClass('badge-danger')) {
    appendText = '|';
  } else {
    appendText = $(this).html();
  }
  if (appendText === '{icon}') {
    var index = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    appendText = `{icon${index}}`;
  }

  var commentElm = $(this).closest('form').find('textarea[name="comments"]');
  commentElm.val(commentElm.val() + appendText);
});

$('.tab-status li a').click(function() {
  var status = $(this).data('status');
  if (status != filter.status) {
    filter.status = status;
    onUpdateTable();
  }
});

$('.tab-servers li a').click(function() {
  var server = $(this).data('server');
  if (server != filter.server) {
    filter.server = server;
    if (!datatableVip) getOrderSummary();
    onUpdateTable();
  }
});

$('.tab-cookie-status li a').click(function() {
  var live_flg = $(this).data('live_flg');
  if (live_flg != filter.live_flg) {
    filter.live_flg = live_flg;
    onUpdateTable();
  }
});


function onUpdateTable() {
  var url = ajaxUrl;
  if (datatableVip) {
    if (filter.server) url += `&server=${filter.server}`;
    if (filter.status) url += `&status=${filter.status}`;
    if (typeof filter.live_flg !== "undefined") url += `&live_flg=${filter.live_flg}`;

    // Add service type
    if ($('#service_type').val()) url += `&type=` + $('#service_type').val();

    datatableVip.ajax.url(url).load(showToolTip);
  } else {
    url += `&status=${filter.status}`;
    if (filter.server) url += `&server=${filter.server}`;

    datatableLog.ajax.url(url).load(showToolTip);
  }
}

function getOrderSummary() {
  if (typeof type == "undefined" || ['report', 'services'].includes(type)) return;
  var url = baseUrl + `/ajax/summary`, requestBody = {type: type};

  if (filter.server) requestBody.server = filter.server;

  $.post(url, requestBody).done(function(data) {
    if (!data.length) return;
    var total = 0;
    $(`.tab-status a .count`).html(0);
    data.forEach(function(row) {
      total += row.total;
      $(`.tab-status a[data-status="${row.status}"] .count`).text(row.total);
    });

    $(`.tab-status a[data-status="all"] .count`).html(total);
  })
}

$(document).on('click', '.copy-on-click', function() {
  var text = $(this).text().trim();
  if ($(this).data('content')) text = $(this).data('content');
  if (!text) return;

  copyText(text);
});

$(document).on('click', '.btn-copy', function () {
  var target = $(this).data('target');
  var text = $(target).val() || $(target).text();
  if (!text) return;

  copyText(text);
});

function copyText(text) {
  // dont know why but it works on mobile
  setTimeout(() => {
    const el = document.createElement('textarea');
    el.value = text.toString().trim();
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999); /* For mobile */
    document.execCommand('copy');
    document.body.removeChild(el);

    toastr.success('Đã sao chép!');
  }, 100);
}

function ln2br(text) {
  return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

function ucFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getTimePasses(timeInput) {
  if (!timeInput) return ' ';

  var seconds = moment().diff(moment(timeInput), 'second');
  if (seconds < 60) return seconds + ' giây trước';
  if (seconds < 60 * 60) return Math.floor(seconds / 60) + ' phút trước';
  if (seconds < 60 * 60 * 24) return Math.floor(seconds / 60 / 60) + ' giờ trước';
  var days = moment().diff(moment(timeInput), 'day');
  if (days < 30) return days + ' ngày trước';
  if (days < 365) return moment().diff(moment(timeInput), 'month') + ' tháng trước';
  return moment().diff(moment(timeInput), 'year') + ' năm trước';
}

function showBotLog(array) {
  var urlPrefix = 'https://fb.com/';
  if (type === 'bot_love_story') urlPrefix += 'stories/';

  if ($.fn.dataTable.isDataTable('#table-log')) {
    $('#table-log').DataTable().destroy();
  }

  $('#table-log thead').html(`
          <tr>
            <th>ID tương tác</th>
            <th>Thời gian</th>
          </tr>
    `);
  $('#table-log tbody').html('');

  array.forEach(function(row) {
    if (!row.time) return;
    var html = ejs.render(
      `<tr class="text-bold">
                   <td><a href="${urlPrefix}<%= row.uid %>" target="_blank"><%= row.uid %></a></td>
                   <td class="text-success"><%= row.time %></td>
                 </tr>`
      , {row: row});
    $('#table-log tbody').append(html);
  });

  $('#modalLog').modal('show');

  $('#table-log').dataTable({
    order: [[ 1, "desc" ]],
  });
}

function checkTiktokLink(that) {
  var link = $(that).val();

  getTiktokLink(link, false).then(response => {
    let [success, data] = response;
    if (success) {
      if (data == link) return;
      $(that).val(data);
      swalSuccess("Cập nhật link thành công");
    } else {
      swalError(data);
    }
  })
}

$('#tiktok_post_link, .tiktok-link').change(function() {
  checkTiktokLink(this);
});
$('[name="post_id"]').change(function() {
  if (typeof type === 'undefined' || !type.match(/vip_.*_tiktok/)) return;
  checkTiktokLink(this);
});

function text(text) {
  return ejs.render('<%= text %>', {text});
}

function downloadFile(filename, text, typeFile) {
  const data = new Blob(['\ufeff' + text], { type: typeFile });
  var textFile = "text";
  window.URL.revokeObjectURL(textFile);
  textFile = window.URL.createObjectURL(data);
  var element = document.createElement("a");
  element.setAttribute("href", textFile);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const wait = (secondMin, secondMax = false) => {
  if (secondMax !== false) secondMin = Math.floor(Math.random() * (secondMax - secondMin + 1)) + secondMin;

  return new Promise(resolve => {
    setTimeout(function() {
      return resolve();
    }, secondMin * 1000);
  });
};

$(document).on('click', '.btn-click-view', function() {
  const parent = $(this).parent();
  parent.find('textarea').show();
  $(this).hide();
});

$.fn.setValue = function(value) {
  if (!this.length) return this; // Ensure element exists

  const inputType = this.prop('type');

  switch (inputType) {
    case 'checkbox':
      const checked = value == '1' || value == 'on';
      this.prop('checked', checked);
      break;

    case 'radio':
      const name = this.attr('name');
      $(`[name="${name}"][value="${value}"]`).prop('checked', true);
      break;

    default:
      // If CKEditor
      if (inputType === 'textarea' && this.hasClass('content-editor')) {
        const inputId = this.prop('id');

        if (inputId && typeof CKEDITOR !== "undefined" && CKEDITOR.instances[inputId]) {
          CKEDITOR.instances[inputId].setData(value);
          break;
        }
      }

      this.val(value);
      break;
  }

  return this; // Return the jQuery object for chaining
};


