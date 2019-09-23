// pages/user/login.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cps = getCurrentPages();

    if(cps.length >= 2)
    {
      app.refresh_show = cps[cps.length-2].route;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindGetUserInfo: function (e) {
    // 获得最新的用户信息
    if (!e.detail.userInfo) {
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.checkSessionAndLogin();
  },
  checkSessionAndLogin: function () {
    let that = this;
    let cookies = wx.getStorageSync('cookies');

    if (cookies) {
      wx.checkSession({
        success: function () {
          //session_key 未过期，并且在本生命周期一直有效
          wx.navigateBack({});
        },
        fail: function () {
          // session_key 已经失效，需要重新执行登录流程
          wx.removeStorageSync('cookies');
          that.checkSessionAndLogin();
        }
      })
    } else {
      that.login();
    }
  },
  login: function () {console.log('fffff');
    let that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          app.api_request('user/wx_login', { code: res.code }, function (res) {
            if (res.out == 1) {
              wx.setStorageSync('api_user', res.data);
              that.sendUserInfoToServer();
            }
            else {
              wx.showModal({
                title: 'Sorry',
                content: '用户登录失败~',
              })
            }
          });
        }
      }
    });
  },
  sendUserInfoToServer: function () {
    let userInfo = wx.getStorageSync('userInfo');

    app.api_request('user/wx_update', userInfo, function (res) {
      if (res.out == 1) {
        wx.setStorageSync('api_user', res.data);
        wx.navigateBack({});
      }
      else {

        wx.showModal({
          title: 'Sorry',
          content: '同步信息出错~'
        });
      }
    });
  }
})