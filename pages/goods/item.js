// pages/goods/item.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  doFavor: function(e){
    var that = this;
    var is_favor = e.currentTarget.dataset.favor;

    if (is_favor == 0) {
      app.api_request('goods/favor', { goods_id: that.data.id }, function (res) {
        if (res.out == 1) {
          that.setData({ is_favor: 1 });
        }
      });
    }
    else {
      wx.showToast({ title: '您已经收藏了该货品', icon: 'none' });
    }
  },
  detailMinus: function(e){
    var that = this;
    var index = Number(e.target.dataset.index);
    var value = Number(e.target.dataset.value);
    var sizes = that.data.size;

    if(typeof(sizes[index]) !== 'undefined')
    {
      if(value > 0) that.setData({['size['+index+'].detail']: value-1});
    }
  },
  detailPlus: function (e) {
    var that = this;
    var index = Number(e.target.dataset.index);
    var value = Number(e.target.dataset.value);
    var sizes = that.data.size;

    if (typeof (sizes[index]) !== 'undefined') {
      that.setData({ ['size[' + index + '].detail']: value + 1 });
    }
  },
  detailChange: function(e) {
    var that = this;
    var index = Number(e.target.dataset.index);
    var value = Number(e.detail.value);
    var sizes = that.data.size;

    if(value < 0) value = 0;

    if (typeof (sizes[index]) !== 'undefined') {
      that.setData({ ['size[' + index + '].detail']: value });
    }
  },
  getOrder: function(e) {
    var that = this;
    var index = Number(e.target.dataset.index);
    var sizes = that.data.size;

    if (typeof (sizes[index]) !== 'undefined') {
      sizes[index].detail = sizes[index].detail || 0;

      if(Number(sizes[index].detail) == 0)
      {
        wx.showToast({ title: '数量必须大于0', icon: 'none' });
      }
      else
      {
        var goods = {};

        goods.goods_id = that.data.id;
        goods.name = that.data.name;
        goods.model = sizes[index].model;
        goods.unit = sizes[index].unit;
        goods.detail = sizes[index].detail;

        wx.navigateTo({
          url: '/pages/freight/order?goods=' + encodeURIComponent(JSON.stringify(goods))
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options) return;

    var that = this;

    app.api_request('goods/item', options, function (res) {
      if (res.out == 1) {
        that.setData(res.data);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})