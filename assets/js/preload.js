// Lay post uid danh do cac dich vu mua #uid
async function getPostUid(input, silent = true) {
  let data = formatLink(input);

  if (data.endsWith('#')) data = data.replace(/#+$/, '');
  if (data.match(/(^[\d_]+$|^pfbid\w+)/)) return [true, data];

  let uid;
  if (data.match(/facebook\.com|fb\.watch/)) {
    let info;

    if(data.includes("/posts/") || data.includes("/videos/")) {
      let match = data.match(/(posts|videos)\/([\d\w]+)/);
      if (match) uid = match[2];
    } else if(data.includes("fbid=")) {
      let match = data.match(/fbid=([\d\w]+)/);
      if (match) uid = match[1];
    } else if(data.includes("story_fbid=")) {
      uid = explode_by("story_fbid=","&",data);
    } else if (data.includes("/photos/")) {
      info = data.split("/");
      uid = info[info.length-2];
    } else if (data.match(/\/permalink\/([0-9]+)/)) {
      uid = data.match(/\/permalink\/([0-9]+)/)[1];
    } else if (data.match(/watch\/live\/\?v=/)) {
      uid = data.match(/watch\/live\/\?v=([0-9]+)/)[1];
    } else if (data.match(/watch\/\?v=/)) {
      uid = data.match(/watch\/\?v=([0-9]+)/)[1];
    }
    else if (data.match(/watch\/live/) && data.match(/v=\d+/)) {
      uid = data.match(/v=(\d+)/)[1];
    }
    else if (data.match(/\/stories\//)) {
      uid = data.split('?')[0];
    } else if (data.match(/\/reel\//)) {
      let match1 = data.match(/reel\/(\d+)/);
      if (match1) uid = match1[1];
    } else if (data.match(/\/events\//)) {
      let match1 = data.match(/events\/(\d+)/);
      if (match1) uid = match1[1];
    }
    else if (data.match(/\?id=\d+/)) {
      uid = data.match(/\?id=(\d+)/)[1];
    }
    else if (data.match(/multi_permalinks=\d+/)) {
      uid = data.match(/multi_permalinks=([0-9]+)/)[1];
    }
    else if (data.match(/(fb\.watch|facebook\.com\/share\/)/)) {
      if (!silent) {
        swalBlockGetLink().then(confirm => {
          if (confirm) $('#uid').trigger('change');
        })
      }
      let apiResponse = await callAjaxPost('/facebook/get_link_uid', {link: data, type});
      if (!silent) swalClose();
      if (!apiResponse.status) return [false, apiResponse.msg];

      return [true, apiResponse.msg];
    }
  }
  else if(data.includes("instagram.com")) {
    let match = data.match(/com\/p\/([a-zA-Z0-9_.-]+)/);
    if (!match) match = data.match(/com\/([a-zA-Z0-9_.-]+)/);
    if (match) uid = match[1];
  }

  if (!uid) return [false, 'Không nhận ra uid'];

  if ($('#switch_uid_reply').is(':checked')) {
    let match = input.match(/reply_comment_id=([0-9]+)/);
    if (!match) match = input.match(/comment_id=([0-9]+)/);
    if (match) uid = uid + '_' + match[1];
  }

  return [true, uid];
}

// Lay profile info danh cho các dich vu mua bang info #link
async function getProfileInfo(input, silent = true) {
  let link;

  if (input.includes("facebook.com") || input.includes('fb.com')) {
    if (input.includes("profile.php") && !(typeof type !== "undefined" && type === 'review')) {
      let match = input.match(/id=(\d+)/);
      if (match) {
        return [true, {
          id: match[1],
          name: 'Tên khách hàng'
        }]
      }
    }
    else {
      if (input.match(/groups\/(\d+)/)) {
        return [true, {
          id: input.match(/groups\/(\d+)/)[1],
          name: 'Tên Nhóm'
        }]
      }

      let username = "";
      if(input.includes("/posts/")) {
        username = explode_by("facebook.com/","/posts/",input);
      } else if(input.includes("/videos/")) {
        username = explode_by("facebook.com/","/videos/",input);
      } else {
        let regex = /(facebook|fb)\.com\/(.*)/gm;
        let m;
        while ((m = regex.exec(input)) !== null) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          m.forEach((match, groupIndex) => {
            if(groupIndex === 2) username = match;
          });
        }
      }
      if (!username) return [false, 'Không nhận ra link'];

      if (!silent) {
        swalBlockGetLink().then(confirm => {
          if (confirm) $('#link').trigger('change');
        })
      }
      return await getFbInfoFromUsername(username);
    }
  }
  else if(input.includes("instagram")) {
    if (!input.includes("/p/")) {
      link = explode_by("instagram.com/", "/", input);

      return [true, {
        id: link,
        name: 'Tên khách hàng'
      }]
    } else {
      return [false, 'Không nhận ra link'];
    }
  }
  else {
    if (!silent) {
      swalBlockGetLink().then(confirm => {
        if (confirm) $('#link').trigger('change');
      })
    }
    return await getFbInfoFromUsername(input);
  }
}

// Like comment
async function getCommentLink(input) {
  // Neu da dung dinh dang
  if (input.match(/\w+_\d+/)) return [true, input];

  // output should be {post_id}_{comment_id}
  let [success, post_id] = await getPostUid(input, false);
  if (success) {
    let match = input.match(/reply_comment_id=([0-9]+)/);
    if (!match) match = input.match(/comment_id=([0-9]+)/);
    if (match) return [true, post_id + '_' + match[1]];
  }

  return [false, 'Không nhận dạng được link!'];
}

async function getTiktokLink(link, silent = true) {
  if (link.match(/tiktok\.com\/([^\/]+)\/video\/([0-9]+)/)) {
    return [true, formatLink(link)];
  }
  else if (link.match(/tiktok\.com\/@([\w\-._]+)/)) {
    return [true, formatLink(link)];
  }

  if (!silent) {
    swalTimeOut(
        'Đang get link...',
        'info',
        10 * 1000,
        'Thử lại',
        '',
        false).then(confirm => {
          if (confirm) $('#tiktok_post_link').trigger('change');
    });
  }

  if (link.indexOf('https') != 0) link = link.substring(link.indexOf('https'));
  if (link.includes(' ')) link = link.split(' ')[0];

  let data = await callAjaxPost('/api/get-tiktok-info', { link });

  if (data.status == 1) return [true, data.msg];
  return [false, data.msg];
}

//
function reFormatUrl(input) {
  if (input.endsWith('#')) input = input.slice(0, -1);

  const temp = 'https:';
  if (input.includes(temp) && input.indexOf(temp) !== 0) input = temp + input.split(temp)[1];

  if (typeof type !== "undefined" && !type.match(/(youtube|livestream_v2|view_other|video|live_instagram)/) && input.includes('?')) return [true, formatLink(input)];

  return [true, input];
}

// Nhung dich vu mua theo id post
$(document).on("change", "#uid", async function() {
  let inputText = $(this).val();
  if ($('#url').length) $('#url').val(inputText);

  let [success, uid] = await getPostUid(inputText, false);
  if (uid && uid.endsWith('#')) uid = uid.replace(/#+$/, '');

  if (success) {
    $("#uid").val(uid);
    if (typeof toastr !== "undefined") toastr.success("Cập nhật objectId thành công");
  } else {
    if (typeof toastr !== "undefined" && inputText) toastr.error(uid || "Không nhận ra uid");
  }
});

// Post id, thuong la bu bai
$(document).on("change", ".post-id", async function() {
  let [success, uid] = await getPostUid($(this).val(), false);

  if (success) $(this).val(uid);
});

// Dac biet trong comment link
$(document).on("change", "#comment_link", async function() {
  let [success, data] = await getCommentLink($(this).val());
  if (!success) return toastr.error(data);

  $(this).val(data);
  toastr.success('Cập nhật comment ID thành công');
});

// Cac dich vu mua bang URL
$(document).on("change", "#url", async function() {
  if (typeof type == "undefined") return;
  let url = $(this).val();

  let [success, newUrl] = reFormatUrl(url);

  if ((['video', 'livestream_v2'].includes(type) || type.match(/instagram/)) && newUrl.match(/\/share\//)) {
    swalBlockGetLink().then(confirm => {
      if (confirm) $('#url').trigger('change');
    })
    let apiResponse = await callAjaxPost('/facebook/get_link_uid', {link: url, type});
    swalClose();
    if (apiResponse.status) newUrl = apiResponse.msg;
  }

  if (success && newUrl != url) $(this).val(newUrl);
});

async function getFbInfoFromUsername(username) {

}

function formatLink(link) {
  link = link.toString();
  if (!link.includes('?') || link.match(/\?fbid|story_fbid|watch\//) || link.match(/story_fbid|story\.php|multi_permalinks/)) return link;
  return link.split("?")[0];
}

function swalBlockGetLink() {
  return swalTimeOut(
      'Đang get link...',
      'info',
      10 * 1000,
      'Thử lại',
      'Huỷ',
      false);
}

/**
 * Preloaded js
 * This js file will be loaded before other scripts
 */
var allLevels = [0, 1, 2, 3];
var allPriceFields = allLevels.map(function(value) { return 'price_lv' + value });
var datatableLog,
    datatableVip,
    domainStatus = ['Chờ đổi Nameserver', 'Hoạt động', 'Tạm khoá', 'Lỗi Token', 'Tên miền lỗi'],
    ajaxUrl;

var allStatusClass = ['btn-success', 'btn-warning text-white', 'btn-danger', 'btn-primary', 'btn-danger', 'btn-warning text-white'];
allStatusClass[-1] = 'btn-danger';
allStatusClass[10] = 'btn-danger';

function typeGroup(ugroup) {
  return ['Thành Viên', 'Cộng tác viên', 'Đại lý', 'Nhà phân phối'][Number(ugroup)] || "Ăn Mày";
}

function explode_by(begin, end, data) {
  try {
    data = data.split(begin);
    data = data[1].split(end);
    return data[0];
  } catch(ex) {
    return "";
  }
}

function replaceAll(str, find, replace) {
  try {
    return str.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), replace);
  } catch(ex) {
    return "";
  }
}

function round(input, places = 3) {
  const temp = Math.pow(10, places);
  return Math.floor(input * temp) / temp;
}

function formatMoney(input, suffix = '', roundNumber = true) {
  if (!suffix) suffix = '';
  if (suffix == 'd') suffix = '₫';

  if (currency === 'usd') {
    roundNumber = false;
    if (suffix === '₫') suffix = '$';
    if (suffix.match(/vnd|VNĐ/i)) suffix = suffix.replace(/vnd|VNĐ/i, 'USD')
  } else if (currency === 'baht') {
    roundNumber = false;
    if (suffix === '₫') suffix = '฿';
    if (suffix.match(/vnd|VNĐ/i)) suffix = suffix.replace(/vnd|VNĐ/i, 'Baht')
  }

  var number = parseFloat(input);
  if (roundNumber) number = Math.floor(number);
  if (isNaN(number)) return input;

  if (currency === 'usd') number = round(number, 6);
  if (currency === 'baht') number = round(number, 4);

  // If float
  if (number && number.toString().includes('.')) {
    let parts = number.toString().split('.');
    return formatMoney(parts[0]) + '.' + parts[1] + suffix;
  }
  else {
    return number.toLocaleString() + suffix;
  }
}

var components = {
  default: function(text) {
    return ejs.render('<span class="text-success"><%= text %></span>', {text});
  },
  btn_delete_vip_expired: function(full) {
    return `<button data-id="${full.id}" class="btn btn-icon btn-delete-expired" data-toggle="tooltip" title="Xóa">
              <i class="fa fa-trash text-danger"></i>
            </button>`;
  },
  btn_refund_vip: function(vip) {
    return `<a class="btn btn-icon btn-refund-vip" data-toggle="tooltip" title="Hoàn tiền"
               data-id="${vip.id}" data-type="${vip.type}" data-server="${vip.server}">
                <i class="fa fa-trash text-danger"></i>
            </a>`
  },
  btn_view_log: function(full) {
    return `<button class="btn btn-icon btn-view-log" data-toggle="tooltip" title="Xem log"
              data-id="${full.id}">
                <i class="fa-solid fa-chart-line text-primary"></i>
            </button>`
  },
  btn_log_priority: function(row) {
    return `<button class="btn btn-icon btn-log-priority" data-toggle="tooltip" title="Ưu tiên" data-id="${row.id}">
                <i class="fa fa-angle-up text-primary"></i>
            </button>`
  },
  btn_delete_db: function(full) {
    return `<button data-id="${full.id}" data-type="${full.type}" class="btn btn-icon btn-delete-db" data-toggle="tooltip" title="Xóa DB">
                <i class="fa fa-trash text-danger"></i>
            </button>`
  },
  btn_re_check: function(buff) {
    return `
      <button class="btn btn-icon btn-re-check" data-id="${buff.id}" data-type="${buff.type}" data-server="${buff.server}" data-toggle="tooltip" title="Tiếp tục chạy">
        <i class="fas fa-clipboard-check text-primary"></i>
      </button>
    `;
  },
  btn_refund_buff: function(full) {
    return `<button data-id="${full.id}" data-type="${full.type}" class="btn btn-icon btn-refund-buff" data-toggle="tooltip" title="Hoàn tiền">
                <i class="fa fa-trash text-danger"></i>
            </button>`
  },
  btn_warranty_buff: function(full) {
    return `<button data-id="${full.id}" class="btn btn-icon btn-warranty-buff" data-toggle="tooltip" title="Bảo Hành">
                <i class="fas fa-sync-alt text-primary"></i>
            </button>`
  },
  btn_delete_buff: function(full) {
    return `<button data-id="${full.id}" data-type="${full.type}" class="btn btn-icon btn-delete-buff"
              title="Xóa để mua lại">
                <i class="fa fa-trash text-danger"></i>
            </button>`
  },
  btn_edit: function(row, className = 'btn-edit') {
    return `<button data-id="${row.id}" class="btn btn-icon ${className}" title="Sửa">
                <i class="fas fa-edit text-success"></i>
            </button>`
  },
  btn_delete: function(row, className = 'btn-delete') {
    return `<button data-id="${row.id}" class="btn btn-icon ${className}" title="Xóa">
                <i class="fa fa-trash text-danger"></i>
            </button>`
  },
  btn_sync: function(id, className = 'btn-sync', title = 'Đồng bộ') {
    return `<button type="button" data-id="${id}" class="btn btn-icon ${className}" title="${title}">
                <i class="text-primary fa fa-repeat"></i>
            </button>`;
  },
  btn_edit_log: function(full) {
    return `<button data-id="${full.id}" data-type="${full.type}" class="btn btn-icon btn-edit-log" data-toggle="tooltip" title="Sửa">
                <i class="fas fa-edit text-success"></i>
            </button>`
  },
  btn_edit_vip: function(vip) {
    return `<button data-id="${vip.id}" class="btn btn-icon btn-edit-vip" data-toggle="tooltip" title="Sửa">
              <i class="fas fa-edit text-success"></i>
            </button>`;
  },
  btn_add_post: function(vip) {
    return `<button data-id="${vip.id}" class="btn btn-icon btn-add-post" data-toggle="tooltip" title="Bù bài lỗi">
              <i class="fas fa-plus-circle text-success"></i>
            </button>`;
  },
  btn_edit_bot: function(id) {
    return `
      <button class="btn btn-icon btn-edit-bot" data-id="${id}" data-toggle="tooltip" title="Sửa gói">
        <span class="fas fa-edit text-success"></span>
      </button>
    `
  },
  btn_view_log_bot: function(bot) {
    return `
      <button class="btn btn-icon btn-view-bot-log" data-order_id="${bot.order_id}" data-toggle="tooltip" title="Xem log">
        <span class="fa fa-eye text-warning"></span>
      </button>
    `
  },
  btn_extend_vip: function(vip) {
    return `
      <button class="btn btn-icon btn-extend-vip" data-toggle="tooltip" title="Gia hạn"
              data-id="${vip.id}" data-type="${vip.type}" data-server="${vip.server}">
        <i class="fas fa-clock text-success"></i>
      </button>
    `;
  },
  btn_check_proxy: function(proxy) {
    return `<button class="btn btn-icon btn-check-proxy" data-toggle="tooltip" title="Check Proxy" data-order_id="${proxy.order_id}">
              <i class="fas fa-check-circle text-primary"></i>
            </button>`
  },
  badge_success: (text) => {
    return `<span class="badge badge-success">${text}</span>`;
  },
  badge_primary: (text) => {
    return `<span class="badge badge-primary">${text}</span>`;
  },
  badge_warning: (text) => {
    return `<span class="badge badge-warning">${text}</span>`;
  },
  badge_danger: (text) => {
    return `<span class="badge badge-danger">${text}</span>`;
  },
  text_copyable: text => {
    return `
       <span class="copy-on-click text-success" data-title="Sao chép"
          data-toggle="tooltip" data-content="${text}">
          <i class="fa-regular fa-clipboard"></i>
          ${text}
      </span>
    `
  },
  table: {
    id: function (data, typeT, full) {
      return ejs.render('<span class="text-success text-bold id-<%= full.id %>"><%= data %></span>', {data, full});
    },
    uid: function(data, type, full) {
      if (full && ['proxy', 'bank_voucher', 'services'].includes(full.type)) return components.table.text_primary(data);

      if (data === 'NULL') return ' ';
      if (full.link && full.link !== 'default') {
        if (!full.link.match(/^(http)/)) {
          if (!full.link.toString().includes('.')) full.link = 'https://fb.com/' + full.link;
          else full.link = 'https://' + full.link;
        }

        if (data.length > 30) data = data.substring(0, 28) + '...';

        return ejs.render('<a href="<%= full.link %>" class="text-bold" target="_blank"><%= data %></a>', {data, full});
      } else {
        var prefix = 'fb.com';
        if (full.type.match(/instagram/)) prefix = 'instagram.com';
        if (full.type.match(/twitter/)) prefix = 'x.com';
        if (full.type.match(/tiktok/)) {
          prefix = 'www.tiktok.com';
          data = '@' + data;
        }
        return ejs.render('<a href="https://<%= prefix %>/<%= data %>" class="text-bold" target="_blank"><%= data %></a>', {data, full, prefix});
      }
    },
    user: function(data) {
      return `<span class="text-warning text-bold">${data}</span>`;
    },
    server: function(data, t, log) {
      var mapping;
      if (log.type == 'view_other') {
        mapping = {
          server_1: '600k phút - SV Thường',
          server_2: '600k phút - SV Rẻ',
          server_3: '15k tương tác',
        };
        data = mapping[data] || 'null';
      } else {
        if (data) data = data.replace('server_', 'Server ');
        if (!data) data = '';
      }
      return `<span class="text-danger text-bold">${data}</span>`;
    },
    content: function(data, typeT, full) {
      return ejs.render('<div class="table-text-plain"><%= data %></div>', {data, full});
    },
    note: function(data, typeT, full) {
      return ejs.render('<div class="table-text-plain note-<%= full.id %>"><%= data %></div>', {data, full});
    },
    admin_note: function(data, typeT, full) {
      return ejs.render('<div class="table-text-plain text-danger admin_note-<%= full.id %>"><%= data %></div>', {data, full});
    },
    original: function(data, typeT, full) {
      return ejs.render('<button class="btn btn-brand original-<%= full.id %>"><%= data %></button>', {data, full});
    },
    present: function(data, typeT, full) {
      return ejs.render('<button class="btn btn-success present-<%= full.id %>"><%= data %></button>', {data, full});
    },
    price: function(data, typeT, full) {
      return `<span class="kt-badge kt-badge--success kt-badge--inline money-value">${formatMoney(full.price_current)}</span> 
                        <span>${full.math || '+'}</span> 
                        <span class="kt-badge kt-badge--danger kt-badge--inline money-value">${formatMoney(full.price || full.commission || 0)}</span> 
                        <span>=</span> 
                        <span class="kt-badge kt-badge--primary kt-badge--inline money-value">${formatMoney(full.price_left)}</span>`;
    },
    count: function(data, typeT, full) {
      return ejs.render('<button class="btn btn-danger count-<%= full.id %>"><%= data %></button>', {data, full});
    },
    package: function(data, typeT, full) {
      return ejs.render('<button class="btn btn-danger package-<%= full.id %>"><%= data %></button>', {data, full});
    },
    time: function(data) {
      if (!data) return ' ';
      return `<button class="btn btn-success">${moment(data).format('HH:mm:ss DD/MM/YYYY')}</button>`;
    },
    time_text: function(data) {
      if (!data) return ' ';
      return `<span class="text-success">${moment(data).format('HH:mm:ss DD/MM/YYYY')}</span>`;
    },
    status: function(data, typeT, full) {
      return getStatusHtml(full);
    },
    duration: function(data) {
      return ejs.render('<button class="btn btn-danger btn-ssm"><%= data %></button>', {data});
    },
    vip_status: function(data, typeT, full) {
      return getStatusVipHtml(full);
    },
    type: function(data) {
      return ejs.render('<button class="btn btn-primary"><%= data %></button>', {data});
    },
    comment: function(data) {
      if (typeof data == 'string') console.log('data string', data)
      return components.click_to_view(data.content);
    },
    text: function(data) {
      return ejs.render('<span class="text-bold"><%= data %></span>', {data});
    },
    domain_status: function(data) {
      var status = domainStatus[data];
      return ejs.render(`<span class="badge b-status-${data}"><%= status %></span>`, {status});
    },
    text_success: function(data) {
      if (data == 0 && data.toString().length) data = '0';
      if (!data) data = '';
      return ejs.render(`<span class="text-success text-bold"><%= data %></span>`, {data});
    },
    text_primary: function(data) {
      if (data == 0 && data.toString().length) data = '0';
      if (!data) data = '';
      return ejs.render(`<span class="text-primary text-bold"><%= data %></span>`, {data});
    },
    text_info: function(data) {
      if (data == 0 && data.toString().length) data = '0';
      if (!data) data = '';
      return ejs.render(`<span class="text-info text-bold"><%= data %></span>`, {data});
    },
    text_warning: function(data) {
      if (data == 0 && data.toString().length) data = '0';
      if (!data) data = '';
      return ejs.render(`<span class="text-warning text-bold"><%= data %></span>`, {data});
    },
    text_money: function(data) {
      if (data == 0 && data.toString().length) data = 0;
      return `<span class="text-money text-bold">${formatMoney(data)}</span>₫`;
    },
    text_danger: function(data) {
      if (data == 0 && data.toString().length) data = '0';
      if (!data) data = '';
      return ejs.render(`<span class="text-danger text-bold"><%= data %></span>`, {data});
    },
    like_count: function(data) {
      return `<span class="text-danger text-bold">${data}</span>`;
    },
    action_group_service: function(data, typeT, order) {
      var html = '';

      if (isReCheckAble(order)) html += components.btn_re_check(order);
      if (isRefundAble(order)) html += components.btn_refund_buff(order);
      if (!!order.can_warranty) html += components.btn_warranty_buff(order);

      if (type == 'livestream_v2') {
        if (order.status == 0) {
          if (['server_1', 'server_2', 'server_3'].includes(order.server)) {
            html += `<button class="btn btn-icon btn-cancel-live" data-toggle="tooltip" title="Dừng live" data-id="${order.id}">
                    <i class="fa fa-eye-slash text-danger"></i>
                </button>`
          } else if (['server_5'].includes(order.server)) {
            if (moment().diff(moment(order.time), 'minute') >= 5) {
              html += `<button class="btn btn-icon btn-cancel-live" data-toggle="tooltip" title="Yêu cầu dừng và hoàn tiền" data-id="${order.id}">
                      <i class="fa fa-eye-slash text-danger"></i>
                  </button>`
            }
          }
        }
        if (['server_5'].includes(order.server)) {
          html += components.btn_view_log(order);
        }
      }
      else if (['live_tiktok', 'live_youtube'].includes(type) && moment().diff(moment(order.createdAt), 'day') < 7) {
        html += components.btn_view_log(order);
      }

      // Don hand running, da tao qua 3p
      if (order.can_speed_up) {
        html += `<button class="btn btn-icon btn-speedup-live" data-toggle="tooltip" title="Tăng tốc" data-id="${order.id}">
                      <i class="fa fa-bolt-lightning text-danger"></i>
                  </button>`;
      }

      return html;
    },
    payment_mode: function(is_auto, t, full) {
      return `<span class='text-${is_auto ? 'danger' : 'success'} text-bold'>${parseInt(is_auto) ? ('Tự động' + (full.extra || '')) : 'Thủ công'}</span>`;
    },
    textarea: function(data) {
      return ejs.render('<textarea class="form-control in-table"><%= data %></textarea>', {data});
    },
    changed_money: function(data) {
      return `<span class="text-danger text-bold">${formatMoney(data, " VNĐ") + (data < 0 ? ' (trừ đi)</span>' : '')}</span>`;
    },
    number: function(data) {
      return `<span class="text-danger text-bold">${formatMoney(data, "")}</span>`;
    },
    money_vnd: function(data) {
      return `<span class="text-danger text-bold">${formatMoney(data, " VNĐ")}</span>`;
    },
  },
  click_to_view: function(content) {
    if (!content || content == '{}') return ' ';

    return ejs.render(`
            <div class="click-to-view">
                <button class="btn btn-click-view">Xem</button>
                <textarea class="form-control" style="display: none" rows="4"><%= content %></textarea>
            </div>
      `, {content});
  },
  enable: enable => enable ? 'Không' : 'Có',
  bool: value => components.table.text_primary(value ? 'Có' : 'Không'),
  time_expired: function(data) {
    if (isExpired(data)) return `<button class="btn btn-danger text-bold">Hết hạn (${moment(data).format('DD/MM/YYYY')})</button>`;
    var daysLeft = Math.ceil(moment(data)['diff'](moment(), 'hours') / 24);
    return `<button class="btn btn-primary">${moment(data).format('DD/MM/YYYY')}<br />(${daysLeft} ngày)</button>`;
  }
};

function isRefundAble(log) {
  if (!log.order_id || ![0, 10].includes(parseInt(log.status)) || !log.server) return false;

  if (svRefundWhenCheck.includes(log.server)) return log.status == 10 && svRefundable.includes(log.server);
  return svRefundable.includes(log.server);
}

function isReCheckAble(log) {
  return log.server && log.status == 10 && typeof svCanRecheck !== "undefined" && svCanRecheck.includes(log.server);
}

function makeColumn(title, name, render = null, disableSort = false) {
  var obj = {
    title: title,
    data: name,
    name: name
  };

  if (disableSort) Object.assign(obj, {orderable: false, searchable: false});
  if (!render) render = name;
  if (render) {
    if (typeof render === 'string') {
      if (typeof components[render] !== "undefined") obj.render = components[render];
      if (!obj.render && typeof components.table[render] !== "undefined") obj.render = components.table[render];
      if (!obj.render || obj.render == 'random') {
        var values = ['text_success', 'text_primary', 'text_warning', 'text_danger', 'text_info'];
        obj.render = components.table[values[Math.floor(Math.random() * values.length)]];
      }
    } else obj.render = render;
  }
  return obj;
}

function getAllStatus() {
  var result = ['Đang chạy', 'Đã xong', 'Đã hủy bởi admin', 'Đã hoàn tiền', 'Chờ huỷ đơn'];
  result[-1] = 'Chờ xử lý';
  result[10] = 'Cần Check';
  return result;
}

function getStatusHtml (full, textOnly = false) {
  var allStatus = getAllStatus();
  var status = parseInt(full.status);
  var textHtml = allStatus[status];
  if (textOnly) return textHtml;

  var btn = allStatusClass[status];
  return `<button class="btn ${btn} status-${full.id}">${textHtml}</button>`;
}

function getStatusVipHtml (full) {
  if (full.type === 'vip_like' && full.server === 'server_1') return '';
  var allStatus = ['Đang chờ xác nhận', 'Đang chạy', 'Đã hủy bởi admin', 'Đã xong', 'Tạm dừng'];
  var allBtn = ['btn-danger', 'btn-success', 'btn-danger', 'btn-warning text-white', 'btn-danger', 'btn-primary', 'btn-danger', 'btn-warning text-white'];
  var status = parseInt(full.status);
  return `<button class="btn ${allBtn[status]} status-${full.id}">${allStatus[status]}</button>`;
}

/**
 * Re mapping the request url of datatable
 * @param url
 * @param callbackData
 */
function xAjax(url, callbackData = null) {
  if (!ajaxUrl) ajaxUrl = url;
  return {
    url: url,
    data: function( data ) {
      try {
        let order = data.order[0];
        order.field = data.columns[order.column].data;
        data.order_by = order.field;
        data.order_dir = order.dir;
        data.keyword = data.search.value;
        data.order = [];
        data.columns = [];

        if (typeof callbackData == "function") callbackData(data);

        return data;
      } catch (e) {
        console.log(e);
        return data;
      }
    }
  }
}

function notExpired(time) {
  return moment(time).valueOf() > (+ new Date());
}

function isExpired(time) {
  return moment(time).valueOf() < (+ new Date());
}

function getContentArray(text) {
  return text.trim().split("\n").filter(function(line) { return line && line.trim().length });
}

function countLine(text) {
  if (!text) return 0;
  return getContentArray(text).length;
}

function readJson(rawData) {
  try {
    if (rawData instanceof Object) return rawData;
    return JSON.parse(rawData);
  } catch (e) {
    return {};
  }
}

function callAjaxPost(url, postData) {
  return new Promise(function(resolve) {
    $.ajax({
      type: "POST",
      url: url,
      data: postData,
      success: function(data) {
        return resolve(data);
      }
    });
  })
}

function reloadTable() {
  if (datatableVip) datatableVip.ajax.reload(showToolTip, false);
  if (datatableLog) datatableLog.ajax.reload(showToolTip, false);
}

