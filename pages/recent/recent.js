// pages/recent/recent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    tabs: [{
      text: "全部"
    },
    {
      text: "收货"
    },
    {
      text: "发货"
    }]
  },
  tabChange(e) {
    var index = e.detail.index;

    switch (index) {
      case 0:
        break;

      case 1:
        break;
      
      case 2:
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})