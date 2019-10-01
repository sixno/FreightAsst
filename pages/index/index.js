// pages/index/index.js
const app = getApp();

Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    vip: 0,
    vip_end_time: 0
  },
  getUser: function () {
    var that = this;

    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      api_user: app.api_user()
    });
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo
    });
  },
  onLoad: function () {
    app.check_login();

    this.getUser();
  },
  onShow: function () {
    var that = this;

    app.refresh_page(function () {
      that.getUser();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
