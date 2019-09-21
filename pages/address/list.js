// pages/address/list.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    tabs: [{
      text: "我的地址",
      iconPath: "/img/tabbar/map-pin.png",
      selectedIconPath: "/img/tabbar/map-pin2.png"
    },
    {
      text: "我的收藏",
      iconPath: "/img/tabbar/star.png",
      selectedIconPath: "/img/tabbar/star2.png"
    }],
    slideButtons: [{
      text: '默认',
      data: 'set_default'
    }, {
      text: '复制',
      data: 'copy'
    }, {
      text: '编辑',
      data: 'edit'
    }, {
      type: 'warn',
      text: '删除',
      data: 'del'
    }],
    slideButtons1: [{
      text: '复制',
      data: 'copy'
    }, {
      type: 'warn',
      text: '移除',
      data: 'del'
    }]
  },
  tabChange(e) {
    var index = e.detail.index;

    switch(index)
    {
      case 0:
        wx.setNavigationBarTitle({
          title: '地址管理'
        });

        this.getList(0);
      break;

      case 1:
        wx.setNavigationBarTitle({
          title: '地址收藏'
        });

        this.getList(1);
      break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.check_login();

    this.getList(0);
  },
  getList: function(index){
    var that = this;

    if(index == 0)
    {
      app.api_request('address/list?line=0', { user_id: wx.getStorageSync('api_user_id') }, function (res) {
        that.setData({
          tab: 0,
          list: res.data
        });
      });
    }
    else
    {
      that.setData({tab: 1,list: []})
    }
  },
  slideButtonTap(e) {
    var that = this;
    var action = e.detail.data;
    var address_id = e.target.dataset.id;
    var index = e.target.dataset.index;

    switch(action)
    {
      case 'set_default':
        var list = that.data.list;

        if(list[index].default == '1') return ;

        app.api_request('address/set_default', { address_id: address_id }, function (res) {
          if (res.out == 1) {
            var old_index = null;

            for (var i in list) {
              if(list[i].default == '1') old_index = i;
              list[i].default = '0';
            }

            // list[index]['default'] = '1';
            var update = {};
            update['list[' + index + '].default'] = '1';
            if (typeof (old_index !== null)) update['list[' + old_index + '].default'] = '0';

            that.setData(update);
          }
        });
      break;

      case 'copy':
        wx.setClipboardData({
          data: e.target.dataset.copy,
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            });
          }
        });
      break;

      case 'edit':
        app.dat_page = that;
        wx.navigateTo({url: '/pages/address/edit?address_id='+address_id});
      break;

      case 'del':
        app.api_request('address/del', { address_id: address_id }, function (res) {
          var update = {};

          update['list[' + index + '].deleted'] = '1';

          that.setData(update);
        });
      break;
    }
  },
  slideButtonTap1(e) {

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
    if (app.refresh_show == 'pages/address/list') {
      app.refresh_show = false;

      this.getList(this.data.tab);
    }
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
  addAddress: function(){
    var that = this;

    wx.chooseAddress({
      success(res) {
        var data = {};

        data.name = res.userName;
        data.tel = res.telNumber;
        data.province = res.provinceName;
        data.city = res.cityName;
        data.county = res.countyName;
        data.detail = res.detailInfo;
        data.zipcode = res.postalCode;

        app.api_request('address/add',data,function(res){
          var update = {};

          update['list['+ that.data.list.length +']'] = res.data;

          that.setData(update);
        });
      }
    });
  }
});