// pages/express/express.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  getList: function(){
    var that = this;

    app.api_request('freight_company/list','',function(res){
      if (res.out == 1) {
        var list = res.data;

        for(var i in list)
        {
          list[i].update_time = app.date('yyyy-MM-dd hh:mm:ss',list[i].update_time);
        }
        that.setData({ list: list });
      }
    });
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

    app.refresh_page(function(){
      that.getList();
    });
  },
  onTabItemTap(item) {
    this.getList();
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

  }
})