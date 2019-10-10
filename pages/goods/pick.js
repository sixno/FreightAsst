// pages/goods/pick.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    favor: 0,
    list: []
  },
  getList: function(line)
  {
    var that = this;
    var uri = '';

    if(that.data.favor == 0)
    {
      uri = 'goods/list';
    }
    else
    {
      uri = 'goods/favor_list'
    }

    if (that.data.get_list) return;

    that.setData({ get_list: 1 });

    if (typeof (line) == 'undefined') line = '-';

    app.api_request(uri+'?line='+line,'',function(res){
      var data = {};
      var list = [];

      if(res.out == 1){
        if (that.data.list && line != '-') {
          var index = that.data.list.length;

          for (var i in res.data) {
            data['list[' + (Number(index) + Number(i)) + ']'] = res.data[i];
          }
        }
        else {
          data.list = res.data;
        }
      }

      data.line = res.line;
      data.get_list = 0;

      that.setData(data);
    });
  },
  detailMinus: function (e) {
    var that = this;
    var g_idx = Number(e.target.dataset.g_idx);
    var index = Number(e.target.dataset.index);
    var value = Number(e.target.dataset.value);
    var list = that.data.list;

    if (typeof (list[g_idx]) !== 'undefined' && typeof (list[g_idx].size[index]) !== 'undefined') {
      if (value > 0) that.setData({ ['list[' + g_idx + '].size[' + index + '].detail']: value - 1 });
    }
  },
  detailPlus: function (e) {
    var that = this;
    var g_idx = Number(e.target.dataset.g_idx);
    var index = Number(e.target.dataset.index);
    var value = Number(e.target.dataset.value);
    var list = that.data.list;

    if (typeof (list[g_idx]) !== 'undefined' && typeof (list[g_idx].size[index]) !== 'undefined') {
      that.setData({ ['list[' + g_idx + '].size['+ index +'].detail']: value + 1 });
    }
  },
  detailChange: function (e) {
    var that = this;
    var g_idx = Number(e.target.dataset.g_idx);
    var index = Number(e.target.dataset.index);
    var value = Number(e.detail.value);
    var list = that.data.list;

    if (value < 0) value = 0;

    if (typeof (list[g_idx]) !== 'undefined' && typeof (list[g_idx].size[index]) !== 'undefined') {
      that.setData({ ['list[' + g_idx + '].size[' + index + '].detail']: value });
    }
  },
  addGoods: function(e){
    var list = this.data.list;
    var g_idx = e.target.dataset.g_idx;
    var index = e.target.dataset.index;

    if (list[g_idx] && list[g_idx].size[index] && app.dat_page){

      if (!list[g_idx].size[index].detail || list[g_idx].size[index].detail <= 0)
      {
        wx.showToast({
          title: '数量必须大于0',
          icon: 'none'
        });

        return ;
      }

      var idx = app.dat_page.data.contents.length;
      var item = list[g_idx];

      var update = {
        ['contents[' + idx + ']']: {
          goods_id: item.id,
          name: item.name,
          model: item.size[index].model,
          unit: item.size[index].unit,
          detail: item.size[index].detail
        }
      };

      update['formData.freight_content_goods_id_' + idx] = item.id;
      update['formData.freight_content_name_' + idx] = item.name;
      update['formData.freight_content_model_' + idx] = item.size[index].model;
      update['formData.freight_content_unit_' + idx] = item.size[index].unit;
      update['formData.freight_content_detail_' + idx] = item.size[index].detail;

      if(app.dat_page.data.formData.freight_from_user_id)
      {
        if (item.user_id != app.dat_page.data.formData.freight_from_user_id)
        {
          wx.showToast({
            title: '您要添加的货品与已选货品发货人不是同一人',
            icon: 'none'
          });

          return ;
        }
      }
      else
      {
        update['formData.freight_from_user_id'] = item.user_id;
      }

      app.dat_page.setData(update);

      app.dat_page = null;

      wx.navigateBack();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({favor: options.favor});

    this.getList('-');
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