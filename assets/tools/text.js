var app;

function deep_copy(e) {
  if (!e) return e;
  return JSON.parse(JSON.stringify(e));
}
function super_get_random(e, t) {
  return Math.floor(Math.random() * (t - e + 1) + e)
}
function super_replace_all(e, t, o) {
  var n = new RegExp("(\\" + [")", "(", "*", "[", "]", "{", "}", "|", "^", "<", ">", "\\", "?", "+", "=", "."].join("|\\") + ")","g");
  t = t.replace(n, "\\$1");
  return void 0 !== e && (e = e.replace(new RegExp(t,"g"), o)),
    e
}
function super_get_current_second() {
  var e = new Date;
  return Math.floor(e.getTime() / 1e3)
}
function super_sub_string(e, t, o, n) {
  var _ = "";
  if (e)
    if (e = e.toString(),
      t) {
      if (-1 !== (a = e.toString().indexOf(t)))
        if (o)
          _ = -1 !== (r = e.toString().indexOf(o, a + t.length)) ? e.substring(a + t.length, r) : n ? e.substring(a + t.length) : "";
        else
          _ = n ? e.substring(a + t.length) : "";
      else
        _ = ""
    } else {
      var r, a = 0;
      if (o)
        _ = -1 !== (r = e.toString().indexOf(o, a + t.length)) ? e.substring(a + t.length, r) : n ? e.substring(a + t.length) : "";
      else if (n)
        _ = e.substring(a + t.length);
      else
        _ = ""
    }
  return _
}
function super_object_length(e) {
  var t = 0;
  for (var o in e)
    e.hasOwnProperty(o) && t++;
  return t
}
function super_concat_array_valid_ids(e) {
  for (var t = "", o = 0; o < e.length; o++)
    t += t ? "\n" + e[o] : e[o];
  return t
}
function super_get_valid_and_remove_duplicate_ids(e) {
  var t = [];
  if (e)
    for (var o = {}, n = e.toString().split("\n"), _ = 0; _ < n.length; _++) {
      var r = n[_].toString().trim();
      r && !o[r] && (o[r] = 1,
        t.push(r))
    }
  return t
}
function super_get_valid_array_ids(e) {
  var t = [];
  if (e)
    for (var o = e.toString().split("\n"), n = 0; n < o.length; n++) {
      var _ = o[n].toString().trim();
      _ && t.push(_)
    }
  return t
}
function super_phpjs_preg_quote(e, t) {
  return (e + "").replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\" + (t || "") + "-]","g"), "\\$&")
}
function super_array_to_csv(e, t, o, n) {
  !1 === t && (t = ";"),
  !1 === o && (o = '"');
  var _ = []
    , r = super_phpjs_preg_quote(t, "/")
    , a = super_phpjs_preg_quote(o, "/")
    , i = new RegExp("(?:" + r + "|" + a + "|\\s)","gi");
  for (var s in e) {
    var u = e[s];
    n || i.test(u) ? (u = super_replace_all(u = super_replace_all(u, o, o + o), t, "\\" + t),
      _.push(o + u + o)) : _.push(u)
  }
  return _.join(t)
}
function super_csv_to_array(e, t, o, n) {
  !1 === t && (t = ";"),
  !1 === o && (o = '"');
  for (var _ = [], r = (e = super_replace_all(e, "\\" + t, "ECOM_SLASH_SPECIAL")).toString().split(o + t + o), a = 0; a < r.length; a++) {
    var i = r[a];
    i[0] && i[0] == o && (i = i.substring(1, i.length)),
    i[i.length - 1] && i[i.length - 1] == o && (i = i.substring(0, i.length - 1)),
      i = super_replace_all(i = super_replace_all(i, o + o, o), "ECOM_SLASH_SPECIAL", t),
      _.push(i)
  }
  return _
}
function super_compare_operation(e, t, o) {
  return "eq" == e ? t == o : "neq" == e ? t != o : "lt" == e ? (t = parseInt(t)) < (o = parseInt(o)) : "gt" == e ? (t = parseInt(t)) > (o = parseInt(o)) : "lte" == e ? (t = parseInt(t)) <= (o = parseInt(o)) : "gte" == e ? (t = parseInt(t)) >= (o = parseInt(o)) : "contain" == e ? t.toString().indexOf(o) >= 0 : "ncontain" == e ? !(t.toString().indexOf(o) >= 0) : "regex" == e ? null != t.match(o) : void 0
}
function super_check_valid_format_c_user_cookie_and_convert_to_json_cookie_string(e) {
  var t = "";
  if (e) {
    for (var o = super_get_valid_array_ids(e), n = 0; n < o.length; n++) {
      var _ = o[n].toString().trim();
      if (_) {
        var r = super_convert_c_user_cookie_to_json_string(_);
        r && (t += t ? "\n" + r : r)
      }
    }
    t = super_concat_array_valid_ids(super_get_valid_and_remove_duplicate_ids(t))
  }
  return t
}
function super_convert_c_user_cookie_to_json_obj(e) {
  var t = !1
    , o = !1
    , n = {}
    , _ = [];
  if (e) {
    var r = super_default_fb_cookie_fields();
    e = e.toString().split(";");
    for (var a = 0; a < e.length; a++)
      if (e[a] = e[a].toString().trim(),
        e[a]) {
        var i = e[a].split("=");
        if (2 == i.length)
          var s = i[0].toString().trim()
            , u = i[1].toString().trim();
        else
          s = e[a],
            u = "";
        if (n[s] && (_[n[s] - 1].domain = "www.facebook.com",
          _[n[s] - 1].hostOnly = !0),
          n[s] = _.length + 1,
          r[s])
          var c = deep_copy(r[s]);
        else
          c = deep_copy(r.default);
        c.name = s,
          c.value = u,
          _.push(c),
        "c_user" == s && (t = !0),
        "xs" == s && (o = !0)
      }
  }
  return t && o && _.length > 0 ? _ : ""
}
function super_convert_c_user_cookie_to_json_string(e) {
  var t = !1
    , o = !1
    , n = {}
    , _ = [];
  if (e) {
    var r = super_default_fb_cookie_fields();
    e = e.toString().split(";");
    for (var a = 0; a < e.length; a++)
      if (e[a] = e[a].toString().trim(),
        e[a]) {
        var i = e[a].split("=");
        if (2 == i.length)
          var s = i[0].toString().trim()
            , u = i[1].toString().trim();
        else
          s = e[a],
            u = "";
        if (n[s] && (_[n[s] - 1].domain = "www.facebook.com",
          _[n[s] - 1].hostOnly = !0),
          n[s] = _.length + 1,
          r[s])
          var c = deep_copy(r[s]);
        else
          c = deep_copy(r.default);
        c.name = s,
          c.value = u,
          _.push(c),
        "c_user" == s && (t = !0),
        "xs" == s && (o = !0)
      }
  }
  return t && o && _.length > 0 ? JSON.stringify(_) : ""
}
function super_convert_json_cookie_obj_to_c_user_cookie(e) {
  var t = "";
  if (e)
    for (var o in e)
      if (e[o].name) {
        var n = e[o].name
          , _ = e[o].value;
        t += t ? ";" + n + "=" + _ : n + "=" + _
      }
  return super_get_user_fb_id_from_c_user_cookie(t) ? t : ""
}
function super_convert_json_cookie_string_to_one_line(e) {
  var t = []
    , o = (e ? e.toString().split("\n") : []).join(" ");
  for (o = o.replace(/("[^"]*")|\s/g, "$1"); ; ) {
    var n = o
      , _ = -1
      , r = o.toString().indexOf("][")
      , a = o.toString().indexOf("{}")
      , i = o.toString().indexOf("]{")
      , s = o.toString().indexOf("}[");
    if ((-1 == (_ = r) || _ > a && -1 !== a) && (_ = a),
    (-1 == _ || _ > i && -1 !== i) && (_ = i),
    (-1 == _ || _ > s && -1 !== s) && (_ = s),
    -1 === _) {
      n && t.push(n);
      break
    }
    n = o.substring(0, _ + 1),
      o = o.substring(_ + 1),
      t.push(n)
  }
  for (var u = "", c = 0; c < t.length; c++)
    if (u)
      try {
        u += "\n" + JSON.stringify(JSON.parse(t[c]))
      } catch (e) {}
    else
      try {
        u += JSON.stringify(JSON.parse(t[c]))
      } catch (e) {}
  return u
}
function super_get_user_fb_id_from_json_cookie_obj(e) {
  var t = "";
  if (e)
    for (var o in e) {
      var n = e[o].name
        , _ = e[o].value;
      if ("c_user" == n) {
        t = _;
        break
      }
    }
  return t
}
function super_get_user_fb_id_from_c_user_cookie(e) {
  return e ? super_get_user_fb_id_from_json_cookie_obj(super_convert_c_user_cookie_to_json_obj(e)) : ""
}
function super_default_fb_cookie_fields() {
  super_get_current_second(),
    super_get_random(0, 1e4);
  return {
    sb: {
      domain: ".facebook.com",
      expirationDate: super_get_current_second() + 59699699,
      hostOnly: !1,
      httpOnly: !1,
      name: "sb",
      path: "/",
      sameSite: "no_restriction",
      secure: !0,
      session: !1,
      storeId: "0",
      value: ""
    },
    pl: {
      domain: ".facebook.com",
      expirationDate: super_get_current_second() + 4403698,
      hostOnly: !1,
      httpOnly: !1,
      name: "pl",
      path: "/",
      sameSite: "no_restriction",
      secure: !0,
      session: !1,
      storeId: "0",
      value: ""
    },
    "x-referer": {
      domain: ".facebook.com",
      hostOnly: !1,
      httpOnly: !1,
      name: "x-referer",
      path: "/",
      sameSite: "no_restriction",
      secure: !1,
      session: !0,
      storeId: "0",
      value: ""
    },
    c_user: {
      domain: ".facebook.com",
      expirationDate: super_get_current_second() + 7771735,
      hostOnly: !1,
      httpOnly: !1,
      name: "c_user",
      path: "/",
      sameSite: "no_restriction",
      secure: !0,
      session: !1,
      storeId: "0",
      value: ""
    },
    xs: {
      domain: ".facebook.com",
      expirationDate: super_get_current_second() + 7771735,
      hostOnly: !1,
      httpOnly: !1,
      name: "xs",
      path: "/",
      sameSite: "no_restriction",
      secure: !0,
      session: !1,
      storeId: "0",
      value: ""
    },
    csm: {
      domain: ".facebook.com",
      expirationDate: super_get_current_second() + 7771735,
      hostOnly: !1,
      httpOnly: !1,
      name: "csm",
      path: "/",
      sameSite: "no_restriction",
      secure: !1,
      session: !1,
      storeId: "0",
      value: ""
    },
    s: {
      domain: ".facebook.com",
      expirationDate: super_get_current_second() + 7771735,
      hostOnly: !1,
      httpOnly: !1,
      name: "s",
      path: "/",
      sameSite: "no_restriction",
      secure: !0,
      session: !1,
      storeId: "0",
      value: ""
    },
    lu: {
      domain: ".facebook.com",
      expirationDate: super_get_current_second() + 63067735,
      hostOnly: !1,
      httpOnly: !1,
      name: "lu",
      path: "/",
      sameSite: "no_restriction",
      secure: !0,
      session: !1,
      storeId: "0",
      value: ""
    },
    p: {
      domain: ".facebook.com",
      hostOnly: !1,
      httpOnly: !1,
      name: "p",
      path: "/",
      sameSite: "no_restriction",
      secure: !1,
      session: !0,
      storeId: "0",
      value: ""
    },
    datr: {
      domain: ".facebook.com",
      expirationDate: super_get_current_second() + 63070099,
      hostOnly: !1,
      httpOnly: !1,
      name: "datr",
      path: "/",
      sameSite: "no_restriction",
      secure: !1,
      session: !1,
      storeId: "0",
      value: ""
    },
    m_ts: {
      domain: ".facebook.com",
      hostOnly: !1,
      httpOnly: !1,
      name: "m_ts",
      path: "/",
      sameSite: "no_restriction",
      secure: !1,
      session: !0,
      storeId: "0",
      value: ""
    },
    fr: {
      domain: ".facebook.com",
      expirationDate: super_get_current_second() + 7774100,
      hostOnly: !1,
      httpOnly: !1,
      name: "fr",
      path: "/",
      sameSite: "no_restriction",
      secure: !1,
      session: !1,
      storeId: "0",
      value: ""
    },
    act: {
      domain: ".facebook.com",
      hostOnly: !1,
      httpOnly: !1,
      name: "act",
      path: "/",
      sameSite: "no_restriction",
      secure: !1,
      session: !0,
      storeId: "0",
      value: ""
    },
    presence: {
      domain: ".facebook.com",
      hostOnly: !1,
      httpOnly: !1,
      name: "presence",
      path: "/",
      sameSite: "no_restriction",
      secure: !0,
      session: !0,
      storeId: "0",
      value: ""
    },
    spin: {
      domain: ".facebook.com",
      hostOnly: !1,
      httpOnly: !1,
      name: "spin",
      path: "/",
      sameSite: "no_restriction",
      secure: !1,
      session: !0,
      storeId: "0",
      value: ""
    },
    m_pixel_ratio: {
      domain: ".facebook.com",
      hostOnly: !1,
      httpOnly: !1,
      name: "m_pixel_ratio",
      path: "/",
      sameSite: "no_restriction",
      secure: !1,
      session: !0,
      storeId: "0",
      value: ""
    },
    default: {
      domain: ".facebook.com",
      expirationDate: super_get_current_second() + 7774100,
      hostOnly: !1,
      httpOnly: !1,
      name: "default",
      path: "/",
      sameSite: "no_restriction",
      secure: !1,
      session: !1,
      storeId: "0",
      value: ""
    }
  }
}

var a = {
  a: deep_copy,
  b: super_array_to_csv,
  c: super_check_valid_format_c_user_cookie_and_convert_to_json_cookie_string,
  d: super_compare_operation,
  e: super_concat_array_valid_ids,
  f: super_convert_json_cookie_obj_to_c_user_cookie,
  g: super_convert_json_cookie_string_to_one_line,
  h: super_csv_to_array,
  i: super_get_user_fb_id_from_c_user_cookie,
  j: super_get_valid_and_remove_duplicate_ids,
  k: super_get_valid_array_ids,
  l: super_object_length,
  m: super_replace_all,
  n: super_sub_string,
}

var n = ''
  , _ = ''
  , r = ''
  , b = ''
  , i = ''
  , s = ""
  , u = ""
  , c = ''
  , l = ""
  , p = ""
  , m = ""
  , g = ""
  , h = ""
  , d = ""
  , f = "";

i += "email=xyz@gmail.com\n",
  i += "pass=1243\n",
  i += "\n",
  i += "email=abc@gmail.com\n",
  i += "pass=elooslge\n",
  i += "\n",
  i += "\n",
  i += "email=sequiz@gmail.com\n",
  i += "pass=suka\n",
  i += "\n",
  i += "email=entry@gmail.com\n",
  i += "pass=\n",
  i += "\n",
  i += "email=\n",
  i += "pass=\n",
  s += "DAAAAE....|user1|pass1\n",
  s += "DAAAAG....|user2|pass2\n",
  s += "DAAAAH....|user3|pass3",
  u += "user1|pass1\n",
  u += "user2|pass2\n",
  u += "user3|pass3",
  c += "good1 good1 good1 good1 good1\n",
  c += "good2 good2 good2 good2 good2\n",
  c += "good3 good3 good3 good3 good3\n",
  c += "bad bad bad bad bad bad",
  l += "one\n",
  l += "two\n",
  l += "three",
  f += "one\n",
  f += "two",
  p += "Nội dung xyzt",
  m += "<img src='http://i.imgur.com/l35eOVBb.jpg'/>\n",
  m += "<img src='/KBWh5jOb.jpg'/>\n",
  g += "<a href='http://google.com/1.html'>1.html</a>\n",
  g += "<a href='/2.html'>2.html</a>\n",
  h += "a\nb\nc",
  d += '"id";"name"\n"1";"What The"\n"12";"It is"',
  b += "[\n",
  b += "  {\n",
  b += '    "domain": ".facebook.com",\n',
  b += '    "hostOnly": false,\n',
  b += '    "httpOnly": false,\n',
  b += '    "name": "act",\n',
  b += '    "path": "/",',
  b += '    "sameSite": "no_restriction",\n',
  b += '    "secure": false,\n',
  b += '    "session": true,\n',
  b += '    "storeId": "0",\n',
  b += '    "value": "323235353533",\n',
  b += '    "id": 1\n',
  b += " }\n",
  b += "]\n";
var y = {
  1: "id1|pass1|c_user=111;xs=xxx;sb=xxx;datr=xxx|token1\nid2|pass2|c_user=222;xs=yyy;sb=yyy;datr=yyy|token2",
  4: "id1|pass1|2FA|c_user=123;xs=xxx;sb=xxx;datr=xxx|token1\nid2|pass2|2FA|c_user=289;xs=yyy;sb=yyy;datr=yyy|token2",
  2: "c_user=123;xs=xxx;sb=xxx;datr=xxx\nc_user=289;xs=yyy;sb=yyy;datr=yyy",
  3: '[{"domain":".facebook.com","expirationDate":1539035516.96637,"hostOnly":false,"httpOnly":false,"name":"c_user","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"100004555234544","id":3},{"domain":".facebook.com","expirationDate":1549425065.45827,"hostOnly":false,"httpOnly":true,"name":"xs","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"8888888888nnnnnn888888","id":15},{"domain":".facebook.com","expirationDate":1549425065.45827,"hostOnly":false,"httpOnly":true,"name":"sb","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"aaaaaa","id":15},{"domain":".facebook.com","expirationDate":1549425065.45827,"hostOnly":false,"httpOnly":true,"name":"datr","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"bbbbb","id":15}]\n[{"domain":".facebook.com","expirationDate":1520362211.97014,"hostOnly":false,"httpOnly":false,"name":"c_user","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"100004555234544","id":3},{"domain":".facebook.com","expirationDate":1546047701.54802,"hostOnly":false,"httpOnly":true,"name":"xs","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"8888888888nnnnnn888888","id":15},{"domain":".facebook.com","expirationDate":1549425065.45827,"hostOnly":false,"httpOnly":true,"name":"sb","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"aaaaaa","id":15},{"domain":".facebook.com","expirationDate":1549425065.45827,"hostOnly":false,"httpOnly":true,"name":"datr","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"bbbbb","id":15}]',
  5: "c_user=123;xs=xxx;sb=xxx;datr=xxx\nc_user=289;xs=yyy;sb=yyy;datr=yyy",
  6: "c_user=123;xs=xxx;sb=xxx;datr=xxx\nc_user=289;xs=yyy;sb=yyy;datr=yyy\nc_user=385;xs=yyy;sb=yyy;datr=yyy",
  7: "123\n789\n567",
  8: "c_user=123;xs=xxx;sb=xxx;datr=xxx\nc_user=289;xs=yyy;sb=yyy;datr=yyy\nc_user=385;xs=yyy;sb=yyy;datr=yyy",
  9: "uid|pass|cookie1|2fa\nuid|pass|cookie2|2fa"
}

var v = function(e) {
  var t, o, n, _ = {}, r = 0, a = 0, i = "", s = String.fromCharCode, u = e.length;
  for (t = 0; t < 64; t++)
    _["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(t)] = t;
  for (o = 0; o < u; o++)
    for (r = (r << 6) + _[e.charAt(o)],
           a += 6; a >= 8; )
      ((n = r >>> (a -= 8) & 255) || o < u - 2) && (i += s(n));
  return i
}

$(document).ready(function () {
  $('#app').show();
  app = new Vue({
    el: '#app',
    data: {
      activeTab: "cookie",
      account: "1",
      is_duplicate: !0,
      account_seperate: "|",
      account_input: Object(a.a)(i),
      account_output: "",
      cookie_input: Object(a.a)(y[5]),
      cookie_input_uid: "yyy\nzzz",
      cookie_type: "5",
      cookie_output_type: "3",
      cookie_sort: "1",
      cookie_output: "",
      cut_input: Object(a.a)(s),
      cut_seperate: "|",
      cut_output: "",
      cut_start: 1,
      cut_end: 1,
      cut_mode: "1",
      cut_selection: "1,2",
      merge_input: Object(a.a)(u),
      merge_start_text: "START|",
      merge_end_text: "|END",
      merge_output: "",
      map_input: Object(a.a)(c),
      map_have_text: "good\ngood1",
      map_havenot_text: "bad",
      map_output: "",
      text_input: "sb=Bdi-ue_fQZ; datr=BgVm_eecFso; c_user=100004555234544; xs=32%3AiwE4eOw%3A2%3A183%3A8676%3A81; pl=n; m_pixel_ratio=1;",
      text_start_text: "c_user",
      text_end_text: ";",
      text_type: 0,
      text_output: "",
      duplicate_one_input: Object(a.a)(l),
      duplicate_two_input: Object(a.a)(f),
      duplicate_type: 0,
      duplicate_output: "",
      copy_input: Object(a.a)(p),
      copy_file_name: "google-",
      copy_id_start: 1,
      copy_id_end: 100,
      copy_file_extension: "html",
      copy_feed_text_input: "${text1} ${text2}",
      copy_feed_text_replacement: [{
        id: 0,
        key: "text1",
        value: "line1\nline2\nline3\nline4",
        splitter: 2
      }, {
        id: 1,
        key: "text2",
        value: "linea\nlineb\nlinec\nlined",
        splitter: 3
      }],
      copy_feed_text_length: 2,
      copy_feed_text_file_name: "test-",
      copy_feed_text_id_start: 1,
      copy_feed_text_id_end: 2,
      copy_feed_text_extension: "html",
      split_input: Object(a.a)(p),
      split_file_name: "fbid-",
      split_limit: 1e3,
      split_id_start: 1,
      split_file_extension: "txt",
      extract_image_base_url: "http://i.imgur.com/",
      extract_image_input: Object(a.a)(m),
      extract_image_output: "",
      extract_image_output_html: "",
      extract_link_base_url: "http://google.com/",
      extract_link_input: Object(a.a)(g),
      extract_link_output: "",
      extract_link_output_html: "",
      swap_input: Object(a.a)(h),
      swap_number: 3,
      swap_output: "",
      filter_csv_input: Object(a.a)(d),
      filter_csv_is_header: !0,
      filter_csv_all_header: !0,
      filter_csv_header: {},
      filter_csv_conditions: [],
      filter_csv_header_objs: [],
      filter_csv_operation_objs: [{
        id: "eq",
        name: "="
      }, {
        id: "neq",
        name: "!="
      }, {
        id: "lt",
        name: "<"
      }, {
        id: "gt",
        name: ">"
      }, {
        id: "lte",
        name: "<="
      }, {
        id: "gte",
        name: ">="
      }, {
        id: "contain",
        name: "chứa"
      }, {
        id: "ncontain",
        name: "không chứa"
      }, {
        id: "regex",
        name: "regex"
      }],
      filter_csv_output: "",
      filter_merge_file_input1: "A\nC",
      filter_merge_file_input2: "B\nD",
      filter_merge_file_seperate_text: " + ",
      filter_merge_file_output: "",
      filter_sort_input: "C\nB\nA",
      filter_sort_output: "",
      filter_json_to_one_line_input: Object(a.a)(b),
      filter_json_to_one_line_output: "",
      filter_merge_lines_input: "a\nb",
      filter_merge_lines_mode: "all",
      filter_merge_lines_seperate: "|",
      filter_merge_lines_output: "",
      filter_split_lines_input: "A|B|C",
      filter_split_lines_seperate: "|",
      filter_split_lines_output: "",
      extract_tag_input: "[IMG]http://www.use.com/images/s_1/ff4aa1e27bbfa78b04d1_2.jpg[/IMG]",
      extract_tag_start: "[IMG]",
      extract_tag_end: "[/IMG]",
      extract_tag_output: "",
      check_live_account_input: "4",
      check_live_object: {
        list_accounts: "",
        live_account: "",
        die_account: "",
        total_live_account: 0,
        total_die_account: 0,
        total_account: 0
      },
      check_live_tmp_checking: 0,
      filter_text_input: "abc\nabcde",
      filter_text_max_char_length: 5,
      filter_text_output: "",
      filter_text_word_separation: "",
      join_text_one_input: "ey1\ney2",
      join_text_two_input: "id1|500\nid2|10000",
      join_text_sub_per_token: 500,
      join_text_output: "",
      sub_input_1: "4|2078|11000",
      sub_input_2: "4|12000",
      sub_output: ""
    },
    watch: {
      cookie_type: function() {
        this.cookie_input = Object(a.a)(y[this.cookie_type]);
        this.cookie_output = "";
        this.cookie_sort = "1";
      }
    },
    computed: {
      filter_csv_show_delete_condition: function() {
        return this.filter_csv_conditions.length > 1
      }
    },
    created: function() {
      // this.fitler_csv_init()
    },

    methods: {
      toggle_is_duplicate: function() {
        this.is_duplicate = !this.is_duplicate;
      },
      filter_sub: function() {
        var e = this.sub_input_1.split("\n")
          , t = this.sub_input_2.split("\n")
          , o = ""
          , n = new Map;
        e.forEach(function(e) {
          var t = e.split("|");
          3 == t.length && n.set(t[0], -(parseInt(t[1]) + parseInt(t[2])))
        });
        t.forEach(function(e) {
          var t = e.split("|");
          2 == t.length && (n.has(t[0]) ? n.set(t[0], n.get(t[0]) + parseInt(t[1])) : n.set(t[0], parseInt(t[1])))
        });
        n.forEach(function(e, t) {
          o += t + "|" + e + "\n"
        });
        this.sub_output = o
      },
      join_text: function() {
        for (var e = this.join_text_one_input.split("\n"), t = this.join_text_two_input.split("\n"), o = "", n = 0, _ = e.length, r = 0; r < t.length; r++) {
          var a = t[r];
          if (n >= _) break;
          for (var i = a.split("|"), s = parseInt(i[1]), u = 0; u < s / this.join_text_sub_per_token && (o += e[n] + "|" + i[0] + "\n",
            !(++n >= _)); u++) ;
        }
        if (n < _)
          for (var c = n; c < _; c++)
            o += e[c] + "\n";
        this.join_text_output = o
      },
      removeCopyFeedAtId: function(e) {
        this.copy_feed_text_replacement = this.copy_feed_text_replacement.filter(function(t) {
          return t.id !== e
        })
      },
      addCopyFeedKey: function() {
        this.copy_feed_text_length += 1;
        this.copy_feed_text_replacement.push({
          id: this.copy_feed_text_length,
          key: "",
          value: "",
          splitter: 1
        })
      },
      copy_and_feed_text: function() {
        for (var e, t = this.copy_feed_text_input, o = this.copy_feed_text_id_start, _ = this.copy_feed_text_id_end, a = this.copy_feed_text_file_name, i = this.copy_feed_text_extension, s = (e = (e = this.copy_feed_text_replacement).map(function(e) {
          return e.text = e.value.split("\n"),
            e
        })).length, u = new r.a, c = o; c <= _; c++) {
          for (var l = a + c + "." + i, p = t, m = 0; m < s; m++) {
            var g = (c - 1) * e[m].splitter
              , h = c * e[m].splitter
              , d = e[m].text.slice(g, h).join(",")
              , f = RegExp("\\$\\{" + e[m].key + "\\}", "g");
            p = p.replaceAll(f, d)
          }
          u.file("copy/" + l, p)
        }
        u.generateAsync({
          type: "blob"
        }).then(function(e) {
          Object(n.saveAs)(e, "copy.zip")
        })
      },
      filter_text: function() {
        var e = this
          , t = this.filter_text_input
          , o = Object(a.k)(t).filter(function(t) {
          return t && t.length != e.filter_text_max_char_length
        }).map(function(t) {
          return e.filter_text_word_separation && e.filter_text_word_separation.length > 0 && (t = t.replaceAll(e.filter_text_word_separation, "")),
            t
        }).join("\n");
        this.is_duplicate && (o = Object(a.e)(Object(a.j)(o))),
          this.filter_text_output = o
      },
      filter_account: function() {
        for (var e = "", t = Object(a.k)(this.account_input), o = [], n = 0, _ = 0; _ < t.length; _++) {
          var r = t[_];
          r = n % 2 == 0 ? Object(a.m)(r, "email=", "") : Object(a.m)(r, "pass=", ""),
            o.push(r),
            n++
        }
        for (_ = 0; _ < o.length; _++) {
          r = o[_].toString().trim();
          _ % 2 == 0 ? r && o[_ + 1] && (e += e ? "\n" + r + this.account_seperate : r + this.account_seperate) : r && o[_ - 1] && (e += r)
        }
        this.is_duplicate && (e = Object(a.e)(Object(a.j)(e))),
          this.account_output = e
      },
      filter_cookie: function() {
        var e = this
          , t = "";
        if ("1" == this.cookie_type) {
          for (var o = this.cookie_input, n = Object(a.k)(o), _ = 0; _ < n.length; _++) {
            if (4 == (r = (c = n[_]).split("|")).length) {
              if ((i = r[2]) && -1 === i.toString().indexOf("c_user"))
                2 == (s = v(i).toString().split("|")).length && (i = "c_user=" + s[0] + ";xs=" + window.encodeURIComponent(s[1]));
              t += t ? "\n" + i + ";password=" + r[1] + "|" + r[3] : i + ";password=" + r[1] + "|" + r[3]
            }
          }
          this.is_duplicate && (t = Object(a.e)(Object(a.j)(t)));
          this.cookie_output = t
        } else if ("4" == this.cookie_type) {
          for (o = this.cookie_input,
                 n = Object(a.k)(o),
                 _ = 0; _ < n.length; _++) {
            var r;
            if (5 == (r = (c = n[_]).split("|")).length) {
              var i, s;
              if ((i = r[3]) && -1 === i.toString().indexOf("c_user"))
                2 == (s = v(i).toString().split("|")).length && (i = "c_user=" + s[0] + ";xs=" + window.encodeURIComponent(s[1]));
              t += t ? "\n" + i + ";password=" + r[1] + ";facode=" + r[1] + "|" + r[4] : i + ";password=" + r[1] + ";facode=" + r[1] + "|" + r[4]
            }
          }
          this.is_duplicate && (t = Object(a.e)(Object(a.j)(t)));
          this.cookie_output = t
        } else if ("2" == this.cookie_type) {
          o = this.cookie_input;
          var u = Object(a.c)(o);
          for (n = Object(a.k)(u),
                 _ = 0; _ < n.length; _++) {
            (c = n[_]) && (t += t ? "\n" + c : c)
          }
          this.is_duplicate && (t = Object(a.e)(Object(a.j)(t)));
          this.cookie_output = t
        } else if ("3" == this.cookie_type) {
          for (u = o = this.cookie_input,
                 n = Object(a.k)(u),
                 _ = 0; _ < n.length; _++) {
            var c;
            (c = Object(a.f)(JSON.parse(n[_]))) && (t += t ? "\n" + c : c)
          }
          this.is_duplicate && (t = Object(a.e)(Object(a.j)(t)));
          this.cookie_output = t
        } else if ("5" == this.cookie_type) {
          o = this.cookie_input;
          n = Object(a.k)(o);
          if ("3" !== this.cookie_sort) {
            var l = "1" == this.cookie_sort ? 1 : -1;
            m = n.map(function(e) {
              return Object(a.i)(e)
            }).sort(function(e, t) {
              return l * (parseInt(e) - parseInt(t))
            })
          } else
            m = n.map(function(e) {
              return Object(a.i)(e)
            });
          t = m.join("\n");
          this.is_duplicate && (t = Object(a.e)(Object(a.j)(t)));
          this.cookie_output = t
        } else if ("6" == this.cookie_type) {
          o = this.cookie_input,
            n = Object(a.k)(o),
            l = "1" == this.cookie_sort ? 1 : -1;
          t = (m = n.sort(function(e, t) {
            return l * (parseInt(Object(a.i)(e)) - parseInt(Object(a.i)(t)))
          })).join("\n");
          this.is_duplicate && (t = Object(a.e)(Object(a.j)(t)));
          this.cookie_output = t
        } else if ("7" == this.cookie_type) {
          o = this.cookie_input,
            n = Object(a.k)(o);
          l = "1" == this.cookie_sort ? 1 : -1;
          if ("3" === this.cookie_sort)
            this.cookie_output = this.cookie_input;
          else {
            t = (m = n.sort(function(e, t) {
              return l * (parseInt(e) - parseInt(t))
            })).join("\n");
            this.is_duplicate && (t = Object(a.e)(Object(a.j)(t)));
            this.cookie_output = t
          }
        } else if ("8" == this.cookie_type) {
          o = this.cookie_input;
          n = Object(a.k)(o);
          var p = Object(a.k)(this.cookie_input_uid);
          t = (m = n.filter(function(e) {
            return p.includes(Object(a.i)(e))
          })).join("\n");
          this.is_duplicate && (t = Object(a.e)(Object(a.j)(t)));
          this.cookie_output = t
        } else if ("9" == this.cookie_type) {
          o = this.cookie_input;
          t = (m = (n = Object(a.k)(o)).map(function(e) {
            var t = e.split("|");
            return t[0] + "|" + t[1] + "|" + t[3]
          })).join("\n");
          this.is_duplicate && (t = Object(a.e)(Object(a.j)(t)));
          this.cookie_output = t
        } else if ("10" == this.cookie_type) {
          var m;
          o = this.cookie_input;
          t = (m = (n = Object(a.k)(o)).map(function(t) {
            for (var o = t.split("|"), n = "_", _ = "_", r = 0; r < o.length; r++)
              "_" === n && /^[0-9]{7,}$/g.test(o[r]) ? n = o[r] : o[r] && o[r].startsWith("EAA") && (_ = o[r]);
            switch (e.cookie_output_type) {
              case "1":
                return n;
              case "2":
                return _;
              case "3":
                return n + "|" + _
            }
          })).join("\n");
          this.is_duplicate && (t = Object(a.e)(Object(a.j)(t)));
          this.cookie_output = t;
        }
      },
      cut_text: function() {
        for (var e = "", t = Object(a.k)(this.cut_input), o = this.cut_selection.split(",").map(function(e) {
          try {
            return parseInt(e) - 1
          } catch (e) {
            return -100
          }
        }), n = 0; n < t.length; n++) {
          var _ = t[n]
            , r = this.cut_start - 1
            , i = this.cut_end - 1
            , s = this.cut_seperate
            , u = _.toString().split(s);
          if ("1" === this.cut_mode) {
            if (u[r] && u[i]) {
              for (var c = "", l = r; l <= i; l++)
                c += c ? s + u[l] : u[l];
              e += e ? "\n" + c : c
            }
          } else {
            for (c = "",
                   l = 0; l < u.length; l++)
              o.includes(l) || (c += c ? s + u[l] : u[l]);
            e += e ? "\n" + c : c
          }
        }
        this.is_duplicate && (e = Object(a.e)(Object(a.j)(e)));
        this.cut_output = e
      },
      merge_text: function() {
        for (var e = "", t = Object(a.k)(this.merge_input), o = 0; o < t.length; o++) {
          var n = t[o];
          e += e ? "\n" + this.merge_start_text + n + this.merge_end_text : this.merge_start_text + n + this.merge_end_text
        }
        this.is_duplicate && (e = Object(a.e)(Object(a.j)(e)));
        this.merge_output = e
      },
      map_text: function() {
        for (var e = "", t = Object(a.k)(this.map_input), o = Object(a.k)(this.map_have_text), n = Object(a.k)(this.map_havenot_text), _ = 0; _ < t.length; _++) {
          var r = t[_]
            , i = !0;
          if ("" !== this.map_have_text) {
            for (var s = !1, u = 0; u < o.length; u++)
              if (-1 !== r.toString().indexOf(o[u])) {
                i = !0;
                s = !0;
                break
              }
            i = s
          }
          if ("" !== this.map_havenot_text)
            for (u = 0; u < n.length; u++)
              if (-1 !== r.toString().indexOf(n[u])) {
                i = !1;
                break
              }
          i && (e += e ? "\n" + r : r)
        }
        this.is_duplicate && (e = Object(a.e)(Object(a.j)(e)));
        this.map_output = e
      },
      text_text: function() {
        for (var e = "", t = Object(a.k)(this.text_input), o = 0; o < t.length; o++) {
          var n = t[o]
            , _ = this.text_start_text + Object(a.n)(n, this.text_start_text, this.text_end_text, !1) + this.text_end_text;
          1 == this.text_type ? _ && (e += e ? "\n" + _ : _) : (_ && (n = Object(a.m)(n, _, "")),
            e += e ? "\n" + n : n)
        }
        this.is_duplicate && (e = Object(a.e)(Object(a.j)(e)));
        this.text_output = e
      },
      duplicate_text: function() {
        for (var e = "", t = Object(a.k)(this.duplicate_one_input), o = Object(a.k)(this.duplicate_two_input), n = {}, _ = {}, r = (n = {},
          0); r < t.length; r++)
          n[t[r]] = t[r];
        for (r = 0; r < o.length; r++)
          _[o[r]] = o[r];
        for (r = 0; r < t.length; r++) {
          var i = t[r];
          1 == this.duplicate_type ? _[i] && (e += e ? "\n" + i : i) : _[i] || (e += e ? "\n" + i : i)
        }
        if (0 == this.duplicate_type && "" == e)
          for (r = 0; r < o.length; r++) {
            n[i = o[r]] || (e += e ? "\n" + i : i)
          }
        this.is_duplicate && (e = Object(a.e)(Object(a.j)(e)));
        this.duplicate_output = e
      },
      copy_text: function() {
        for (var e = this.copy_input, t = this.copy_id_start, o = this.copy_id_end, _ = this.copy_file_name, a = this.copy_file_extension, i = new r.a, s = t; s <= o; s++) {
          var u = _ + s + "." + a;
          i.file("copy/" + u, e)
        }
        i.generateAsync({
          type: "blob"
        }).then(function(e) {
          Object(n.saveAs)(e, "copy.zip")
        })
      },
      split_file: function() {
        this.split_download_link = "";
        this.is_duplicate && (this.split_input = Object(a.e)(Object(a.j)(this.split_input)));
        for (var e = this.split_input, t = this.split_limit, o = this.split_id_start, _ = this.split_file_name, i = this.split_file_extension, s = 0, u = "", c = e.split("\n"), l = new r.a, p = 0; p < c.length; p++)
          if (u ? u += "\n" + c[p] : u = c[p],
          ++s >= t) {
            var m = _ + o + "." + i;
            l.file("split/" + m, u),
              s = 0,
              u = "",
              o++
          }
        if (u) {
          m = _ + o + "." + i;
          l.file("split/" + m, u)
        }
        l.generateAsync({
          type: "blob"
        }).then(function(e) {
          Object(n.saveAs)(e, "split.zip")
        })
      },
      extract_image: function() {
        var e = ""
          , t = ""
          , o = Object(a.a)(this.extract_image_base_url);
        "/" == o[o.length - 1] && (o = o.substring(0, o.length - 1)),
          function(e) {
            for (var t, o = /<img.*?src=['"]([^'"]*?)['"][^>]*?>/g, n = []; t = o.exec(e); )
              n.push(t[1]);
            return n
          }(this.extract_image_input).forEach(function(n) {
            n && (-1 === n.toString().indexOf("http://") && -1 === n.toString().indexOf("https://") ? (n = n[0] && n[1] && "/" == n[0] && "/" == n[1] ? "http:" + n : o + n,
              e += e ? "\n" + n : n,
              t += "<div style='margin-top:8px;'><img src='" + n + "' height='100px'/></div>") : (e += e ? "\n" + n : n,
              t += "<div style='margin-top:8px;'><img src='" + n + "' height='100px'/></div>"))
          }),
        this.is_duplicate && (e = Object(a.e)(Object(a.j)(e)),
          t = Object(a.e)(Object(a.j)(t))),
          this.extract_image_output = e,
          this.extract_image_output_html = t
      },
      extract_link: function() {
        var e = ""
          , t = ""
          , o = Object(a.a)(this.extract_link_base_url);
        "/" == o[o.length - 1] && (o = o.substring(0, o.length - 1)),
          function(e) {
            for (var t, o = /<a .*?href=['"]([^'"]*?)['"][^>]*?>/g, n = []; t = o.exec(e); )
              console.log(t),
                n.push(t[1]);
            return n
          }(this.extract_link_input).forEach(function(n) {
            n && (-1 === n.toString().indexOf("http://") && -1 === n.toString().indexOf("https://") ? (n = n[0] && n[1] && "/" == n[0] && "/" == n[1] ? "http:" + n : o + n,
              e += e ? "\n" + n : n,
              t += "<div><a href='" + n + "'>" + n + "</a></div>") : (e += e ? "\n" + n : n,
              t += "<div><a href='" + n + "'>" + n + "</a></div>"))
          }),
        this.is_duplicate && (e = Object(a.e)(Object(a.j)(e)),
          t = Object(a.e)(Object(a.j)(t))),
          this.extract_link_output = e,
          this.extract_link_output_html = t
      },
      swap_keywords: function() {
        var e = function(e) {
          for (var t, o, n = e.length; 0 !== n; )
            o = Math.floor(Math.random() * n),
              t = e[n -= 1],
              e[n] = e[o],
              e[o] = t;
          return e
        }(Object(a.k)(this.swap_input)).join("\n");
        this.is_duplicate && (e = Object(a.e)(Object(a.j)(e))),
          this.swap_output = e
      },
      filter_csv: function() {
        var e = 0
          , t = []
          , o = this.filter_csv_parser_csv();
        if (o.length > 0) {
          this.filter_csv_is_header && (t.push(o[0]),
            e++);
          for (var n = e; n < o.length; n++)
            this.filter_csv_check_condition(o[n]) && t.push(o[n])
        }
        var _ = this.filter_csv_merge_to_csv(t);
        this.is_duplicate && (_ = Object(a.e)(Object(a.j)(_))),
          this.filter_csv_output = _
      },
      filter_merge_file: function() {
        var e = ""
          , t = Object(a.k)(this.filter_merge_file_input1)
          , o = Object(a.k)(this.filter_merge_file_input2);
        if (t.length >= o.length)
          for (var n = 0; n < t.length; n++)
            o[n] ? e += e ? "\n" + t[n] + this.filter_merge_file_seperate_text + o[n] : t[n] + this.filter_merge_file_seperate_text + o[n] : e += e ? "\n" + t[n] + this.filter_merge_file_seperate_text : t[n] + this.filter_merge_file_seperate_text;
        else
          for (n = 0; n < o.length; n++)
            t[n] ? e += e ? "\n" + t[n] + this.filter_merge_file_seperate_text + o[n] : t[n] + this.filter_merge_file_seperate_text + o[n] : e += e ? "\n" + this.filter_merge_file_seperate_text + o[n] : this.filter_merge_file_seperate_text + o[n];
        this.is_duplicate && (e = Object(a.e)(Object(a.j)(e))),
          this.filter_merge_file_output = e
      },
      filter_sort: function() {
        var e = ""
          , t = Object(a.k)(this.filter_sort_input);
        t.sort();
        for (var o = 0; o < t.length; o++) {
          var n = t[o];
          e += e ? "\n" + n : n
        }
        this.is_duplicate && (e = Object(a.e)(Object(a.j)(e))),
          this.filter_sort_output = e
      },
      filter_json_to_one_line: function() {
        var e = this.filter_json_to_one_line_input
          , t = Object(a.g)(e);
        this.is_duplicate && (t = Object(a.e)(Object(a.j)(t)));
        this.filter_json_to_one_line_output = t
      },
      filter_merge_lines: function() {
        var e = "";
        if ("all" === this.filter_merge_lines_mode) {
          for (var t = Object(a.k)(this.filter_merge_lines_input), o = 0; o < t.length; o++)
            e += e ? this.filter_merge_lines_seperate + t[o] : t[o];
          this.is_duplicate && (e = Object(a.e)(Object(a.j)(e)));
          this.filter_merge_lines_output = e
        } else {
          for (t = Object(a.k)(this.filter_merge_lines_input),
                 e = "",
                 o = 0; o < t.length; o++)
            o % 2 == 0 && (e += t[o] + this.filter_merge_lines_seperate + t[o + 1] + "\n");
          this.is_duplicate && (e = Object(a.e)(Object(a.j)(e)));
          this.filter_merge_lines_output = e
        }
      },
      filter_extract_tag: function() {
        var e = ""
          , t = this.extract_tag_input.toString()
          , o = this.extract_tag_start.toString()
          , n = this.extract_tag_end.toString()
          , _ = 0;
        if ("" !== t && "" !== o && "" !== n)
          for (; -1 !== (_ = t.toString().indexOf(o, _)); ) {
            var r = t.toString().indexOf(n, _ + 1);
            if (-1 === r)
              break;
            e += t.substring(_ + o.length, r) + "\n";
            _ = r + n.length
          }
        this.is_duplicate && (e = Object(a.e)(Object(a.j)(e)));
        this.extract_tag_output = e
      },
      filter_split_lines: function() {
        for (var e = "", t = this.filter_split_lines_input.toString().split(this.filter_split_lines_seperate), o = 0; o < t.length; o++)
          e += e ? "\n" + t[o] : t[o];
        this.is_duplicate && (e = Object(a.e)(Object(a.j)(e)));
        this.filter_split_lines_output = e
      },
      fitler_csv_init: function() {
        this.filter_csv_change_content(),
          this.filter_csv_all_header_change("select_all");
        Object(a.l)(this.filter_csv_conditions) <= 0 && this.filter_csv_add_condition()
      },
      filter_csv_all_header_change: function(e) {
        if ("select_all" == e && (this.filter_csv_all_header = !0),
        "all" == e || "select_all" == e)
          for (var t = 0; t < this.filter_csv_header_objs.length; t++) {
            var o = this.filter_csv_header_objs[t];
            this.filter_csv_header[o.id] = this.filter_csv_all_header
          }
        else {
          for (var n = !0, _ = 0; _ < this.filter_csv_header_objs.length; _++) {
            var r = this.filter_csv_header_objs[_];
            this.filter_csv_header[r.id] || (n = !1)
          }
          this.filter_csv_all_header = n
        }
      },
      filter_csv_add_condition: function() {
        this.filter_csv_header_objs.length > 0 && this.filter_csv_conditions.push({
          column: this.filter_csv_header_objs[0].id,
          operation: this.filter_csv_operation_objs[0].id,
          value: ""
        })
      },
      filter_csv_remove_condition: function(e) {
        this.filter_csv_conditions.splice(e, 1)
      },
      filter_csv_change_content: function() {
        var e = []
          , t = this.filter_csv_parser_csv();
        if (t[0])
          for (var o = 0; o < t[0].length; o++)
            e.push({
              id: o,
              name: t[0][o]
            });
        this.filter_csv_header_objs = e,
          this.filter_csv_all_header_change("select_all"),
        Object(a.l)(this.filter_csv_conditions) <= 0 && this.filter_csv_add_condition()
      },
      filter_csv_change_is_header: function() {
        var e = []
          , t = this.filter_csv_parser_csv();
        if (t[0])
          for (var o = 0; o < t[0].length; o++)
            e.push({
              id: o,
              name: t[0][o]
            });
        this.filter_csv_header_objs = e,
        Object(a.l)(this.filter_csv_conditions) <= 0 && this.filter_csv_add_condition()
      },
      filter_csv_parser_csv: function() {
        for (var e = [], t = this.filter_csv_input.toString().toString().split("\n"), o = 0; o < t.length; o++)
          if (t[o] = t[o].toString(),
            t[o].trim()) {
            var n = Object(a.h)(t[o], !1, !1, !0);
            e.push(n)
          }
        return e
      },
      filter_csv_merge_to_csv: function(e) {
        for (var t = "", o = 0; o < e.length; o++) {
          for (var n = [], _ = 0; _ < e[o].length; _++)
            this.filter_csv_header[_] && n.push(e[o][_]);
          var r = Object(a.b)(n, !1, !1, !0);
          '""' !== r && (t += t ? "\n" + r : r)
        }
        return t
      },
      filter_csv_check_condition: function(e) {
        var t = 0;
        for (var o in this.filter_csv_conditions) {
          var n = this.filter_csv_conditions[o];
          "" !== n.value ? e.length > n.column && Object(a.d)(n.operation, e[n.column], n.value) && t++ : t++
        }
        return t == Object(a.l)(this.filter_csv_conditions)
      },
      check_live_account: function() {
        Object(a.j)(this.check_live_account_input)
      }
    }
  });

  $('.el-tabs__item').click(function() {
    $('.el-tabs__item').removeClass('is-active');
    $('.el-tab-pane').hide();
    $('.el-tab-pane#' + $(this).attr('aria-controls')).show();
    $(this).addClass('is-active');
  })
});
