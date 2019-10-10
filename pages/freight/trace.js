// pages/freight/trace.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  copyFN: function(e)
  {
    // console.log(e);
    var freight_no = e.currentTarget.dataset.freight_no;

    wx.setClipboardData({
      data: freight_no,
      success: function (res) {
        wx.showToast({
          title: '成功复制运单号'
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.setData(options);

    app.api_request('freight/trace',{freight_no: options.freight_no,freight_cd: options.freight_cd},function(res){
      if(res.out == 1)
      {
        for(var i in res.data)
        {
          res.data[i].time = app.date('yyyy年MM月dd日 hh:mm:ss', res.data[i].time);
        }

        that.setData({list: res.data});
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