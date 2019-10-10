// pages/user/user.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false,
    buttons: [{ text: '取消' }, { text: '确定' }],
    tab: 0,
    tabs: [{
      text: "协助发货"
    },
    {
      text: "数据共享"
    }],
    slideButtons: [{
      type: 'warn',
      text: '取消共享',
      data: 'remove'
    }]
  },
  tabChange(e) {
    var index = e.detail.index;

    switch (index) {
      case 0:
        this.setData({ tab: 0 });
        break;

      case 1:
        this.setData({ tab: 1 });
        break;
    }
  },
  getUser: function () {
    var that = this;

    app.api_request('user/current','',function(res){
      that.setData({api_user: res.data});
    });
  },
  getList: function(){},
  copyCode: function(e)
  {
    var code = e.currentTarget.dataset.code;

    wx.setClipboardData({
      data: code,
      success: function (res) {
        wx.showToast({
          title: '协助码复制成功'
        });
      }
    });
  },
  slideButtonTap: function (e) {
    var that = this;
    var action = e.detail.data;
    var user_id = e.target.dataset.id;
    var index = e.target.dataset.index;

    switch (action) {
      case 'remove':
        wx.showModal({
          title: '提示',
          content: '确定取消共享发货数据给该用户吗？',
          success(res) {
            if (res.confirm) {
              app.api_request('freight/unshare', { user_id: user_id }, function (res) {
                var update = {};

                update['list[' + index + '].deleted'] = '1';

                that.setData(update);
              });
            }
          }
        });
        break;
    }
  },
  showDialog: function()
  {
    this.setData({
      dialogShow: true
    });
  },
  tapDialogButton(e) {
    console.log('dialog', e.detail)
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
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

    app.check_login();

    app.refresh_page(function () {
      that.getUser();
    });
  },
  onTabItemTap(item) {
    // console.log(item);
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