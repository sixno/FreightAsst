// pages/address/pick.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: ''
  },
  getList: function(){
    var that = this;

    app.api_request('address/list?line=0', '', function (res) {
      that.setData({ list: res.data });
    });
  },
  selectAddress: function(e){
    var list = this.data.list;
    var index = e.target.dataset.index;

    if(list[index] && app.dat_page)
    {
      var item = list[index];
      var update = {};

      update.address = {name: item.name,tel: item.tel,full: item.full,zipcode: item.zipcode};
      update.address_lock = true;

      if(this.data.type == 'send')
      {
        update['formData.freight_from_address_id'] = item.id;
        update['formData.freight_from_name'] = item.name;
        update['formData.freight_from_tel'] = item.tel;
        update['formData.freight_from_address'] = item.full;
        update['formData.freight_from_zipcode'] = item.zipcode;
      }

      if (this.data.type == 'receive') {
        update['formData.freight_to_address_id'] = item.id;
        update['formData.freight_to_name'] = item.name;
        update['formData.freight_to_tel'] = item.tel;
        update['formData.freight_to_address'] = item.full;
        update['formData.freight_to_zipcode'] = item.zipcode;
      }

      app.dat_page.setData(update);

      app.dat_page = null;
    }

    wx.navigateBack({});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({type: options.type});
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