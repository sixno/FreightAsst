// pages/user/user.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    vip: 0,
    vip_end_time: 0,
    tab: 0,
    tabs: [{
      text: "协助发货"
    },
    {
      text: "数据共享"
    }]
  },
  tabChange(e) {
    var index = e.detail.index;

    switch (index) {
      case 0:
        break;

      case 1:
        break;
    }
  },
  getUser: function () {
    var that = this;

    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      api_user: app.api_user()
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser();
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
    var that = this;

    app.refresh_page(function () {
      that.getUser();
    });
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

  }
})