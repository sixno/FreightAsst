//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    vip: 0,
    vip_end_time: 0
  },
  onLoad: function () {
    app.check_login();

    this.getUser();
  },
  onShow: function () {
    if (app.refresh_show == 'pages/index/index') {
      app.refresh_show = false;

      this.getUser();
    }
  },
  getUser: function()
  {
    var that = this;

    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    });

    app.api_request('user/current', '', function (res) {
      if (res.out == 1) {
        that.setData({ vip: res.data.vip, vip_end_time: res.data.vip_end_time });
      }
    });
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo
    });
  }
})
