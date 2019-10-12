//app.js

App({
  inviter: 0,
  onLaunch: function (options) {
    if (options.query.inviter)
    {
      this.inviter = options.query.inviter;
    }

    this.api_login();
  },
  api_token: '',
  api_session: function (res, callback) {
    var that = this;

    if(typeof (res.data) == 'string') res.data = JSON.parse(res.data);

    if (res.data.code == '1000')
    {
      this.api_login(callback);
    }

    if(res.data.code == '0001')
    {
      that.api_token = res.data.data.asst_id;
    }
  },
  api_request: function (url, arg, success, failure, complete) {
    var that = this;
    var args = {};
    var api_base = 'https://asst.sevenxo.com/api.php/';

    var cookies = wx.getStorageSync('cookies');

    args.header = { 'content-type': 'application/json; charset=utf-8','x-token': that.api_token };

    args.url = api_base + url;
    args.method = 'POST';

    if (arg) args.data = arg;

    args.success = function (res) {
      that.api_session(res,function(){
        that.api_request(url,arg,success,failure,complete);
      });

      if(success) success(res.data);
    };

    if (failure) args.fail = failure;
    if (complete) args.complete = complete;

    wx.request(args);
  },
  api_upload: function(step,file,success,failure,complete){
    var that = this;
    var args = {};

    args.url = 'https://asst.sevenxo.com/api.php/common/upload?step=' + step;

    var cookies = wx.getStorageSync('cookies');

    args.header = { 'x-token': that.api_token };

    args.filePath = file;
    args.name = 'file';

    if (success) {
      args.success = function (res) {
        that.api_session(res,function(){
          that.api_upload(step,file,success,failure,complete);
        });

        success(typeof(res.data) == 'string' ? JSON.parse(res.data) : res.data);
      };
    }
    else {
      args.success = function(res){
        that.api_session(res,function(){
          that.api_upload(step,file,success,failure,complete);
        });
      };
    }

    if (failure) args.fail = failure;
    if (complete) args.complete = complete;

    wx.uploadFile(args);
  },
  api_login: function(callback)
  {
    var that = this;

    wx.login({
      success: function (res) {
        if (res.code) {
          that.api_request('user/wx_login', { code: res.code, inviter: that.inviter }, function (res) {
            if (res.out == 1) {
              wx.setStorageSync('api_user', res.data);

              if(callback) callback(res.data);
            }
            else {
              wx.showToast({
                title: '小程序静默登录失败',
                icon: 'none'
              });

              wx.navigateTo({
                url: '/pages/user/login'
              });
            }
          });
        }
      },
      fail: function (res) {
        console.log('获取临时code失败！' + res.errMsg)
      }
    });
  },
  api_user: function(key){
    var that = this;
    var api_user = wx.getStorageSync('api_user');

    if(!api_user) api_user = {};

    if(!key) return api_user;

    return api_user[key];
  },
  check_login: function (callback,fail_get_userInfo) {
    var that = this;

    this.api_request('user/current','',function(res){
      if(res.out == 1)
      {
        wx.setStorageSync('api_user',res.data);

        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo'])
            {
              if (callback) callback(res);

              wx.getUserInfo({
                success: function(res){
                  var userInfo = wx.getStorageSync('userInfo');

                  if(userInfo)
                  {
                    if(userInfo.nickNmae != res.userInfo.nickNmae || userInfo.avatarUrl != res.userInfo.avatarUrl || userInfo.gender != res.userInfo.gender)
                    {
                      wx.setStorageSync('userInfo', res.userInfo);

                      that.sync_userInfo();
                    }
                  }
                  else
                  {
                    wx.setStorageSync('userInfo',res.userInfo);

                    that.sync_userInfo();
                  }
                }
              });
            }
            else
            {
              // wx.navigateTo({ url: "/pages/user/login" });
              if(fail_get_userInfo) fail_get_userInfo();
            }
          },
          fail: function() {
            // wx.navigateTo({ url: "/pages/user/login" });
            if (fail_get_userInfo) fail_get_userInfo();
          }
        });
      }
    });
  },
  sync_userInfo: function(callback){
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');

    if(userInfo)
    {
      that.api_request('user/wx_update', userInfo, callback);
    }
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
  share_options: function()
  {
    var cps = getCurrentPages();
    var cp = cps[cps.length - 1];
    var options = cp.options || {};

    options.inviter = this.api_user('id');

    var query = '?';

    for(var i in options)
    {
      query += i + '=' + options[i] + '&';
    }

    query = query.substr(0,query.length - 1);

    var path = '/' + cp.route + query;

    return {path: path};
  },
  update_cp: function(page,callback){
    var cps = getCurrentPages();

    for(var i in cps)
    {
      if(typeof(page) == 'string')
      {
        if(page == cps[i].route)
        {
          callback(cps[i]);
        }
      }
      else {
        for (var j in page) {
          if (j == cps[i].route) {
            page[j](cps[i]);
          }
        }
      }
    }
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