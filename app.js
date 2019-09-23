//app.js

App({
  onLaunch: function () {
  },
  api_session: function (res) {
    var that = this;
    var set_cookies = null;

    if(res.header) set_cookies = res.header['Set-Cookie'];

    if (set_cookies) {
      var tmp_cookies = set_cookies.split('/,');

      var cookies = wx.getStorageSync('cookies');

      if(!cookies) cookies = {};

      for (var i in tmp_cookies) {
        var cookie = tmp_cookies[i];
        var pos = cookie.indexOf(';');

        if (pos != -1) cookie = cookie.substr(0,pos);

        var cookie_arr = cookie.split('=');

        if(cookie_arr[1] != 'deleted' && cookie_arr[1] !== '')
        {
          cookies[cookie_arr[0]] = cookie_arr[1];
        }
        else
        {
          delete(cookies[cookie_arr[0]]);
        }
      }

      wx.setStorageSync('cookies', cookies);
    }

    if(typeof (res.data) == 'string') res.data = JSON.parse(res.data);

    if (res.data.code == '1000')
    {
      wx.removeStorageSync('cookies');

      // 静默登录好像有点问题啊，只能显式登录了。。。
      // wx.login({
      //   success: function (res) {
      //     if (res.code) that.api_request('user/wx_login', { code: res.code });
      //   }
      // });

      wx.navigateTo({ url: "/pages/user/login" });
    }
  },
  api_request: function (url, arg, success, failure, complete) {
    var that = this;
    var args = {};
    var api_base = 'https://asst.sevenxo.com/api.php/';

    var cookies = wx.getStorageSync('cookies');

    args.header = { 'content-type': 'application/json; charset=utf-8' };

    if(cookies)
    {
      var cookie = '';

      for (var i in cookies)
      {
        if(cookie != '')
        {
          cookie = cookie + '; ' + i + '=' + cookies[i];
        }
        else
        {
          cookie = i + '=' + cookies[i];
        }
      }

      args.header['cookie'] = cookie;
    }

    args.url = api_base + url;
    args.method = 'POST';

    if (arg) args.data = arg;

    if (success) {
      args.success = function (res) {
        that.api_session(res);

        success(res.data);
      };
    }
    else {
      args.success = that.api_session;
    }

    if (failure) args.fail = failure;
    if (complete) args.complete = complete;

    wx.request(args);
  },
  api_upload: function(step,file,success,failure,complete){
    var that = this;
    var args = {};

    args.url = 'https://asst.sevenxo.com/api.php/common/upload?step=' + step;

    var cookies = wx.getStorageSync('cookies');

    args.header = {};

    if (cookies) {
      var cookie = '';

      for (var i in cookies) {
        if (cookie != '') {
          cookie = cookie + '; ' + i + '=' + cookies[i];
        }
        else {
          cookie = i + '=' + cookies[i];
        }
      }

      args.header['cookie'] = cookie;
    }

    args.filePath = file;
    args.name = 'file';

    if (success) {
      args.success = function (res) {
        that.api_session(res);

        success(typeof(res.data) == 'string' ? JSON.parse(res.data) : res.data);
      };
    }
    else {
      args.success = that.api_session;
    }

    if (failure) args.fail = failure;
    if (complete) args.complete = complete;

    wx.uploadFile(args);
  },
  api_user: function(key){
    var api_user = wx.getStorageSync('api_user');

    if(!api_user){
      this.check_login();

      api_user = wx.getStorageSync('api_user');
    }
console.log('api_user',api_user)
    if(!key) return api_user;

    return api_user[key];
  },
  check_login: function () {
    this.api_request('user/current','',function(res){
      if(res.out == 1)
      {
        wx.setStorageSync('api_user',res.data);

        if (!wx.getStorageSync('userInfo')) {
          wx.navigateTo({ url: "/pages/user/login" });
        }
        else {
          wx.checkSession({
            fail: function () {
              wx.navigateTo({ url: "/pages/user/login" });
            }
          });
        }
      }
    });
  },
  date: function (format, time) {
    var format = format || 'yyyy-MM-dd hh:mm:ss';
    var time = time || '';

    if (time == '') {
      var date = new Date();
    }
    else {
      var date = new Date(time * 1000);
    }

    var o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    }

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }

    return format;
  },
  dat_page: null,
  refresh_show: false,
  refresh_page: function(callback){
    var cps = getCurrentPages();
    var cp = cps[cps.length - 1].route;

    if (cp == this.refresh_show) {
      this.refresh_show = false;

      if(callback) callback();
    }
  }
})