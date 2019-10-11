// pages/user/user.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formCode: '',
    dialogShow: false,
    buttons: [{ text: '取消' }, { text: '确定' }],
    tab: 0,
    tabs: [{
      text: "协助发货"
    },
    {
      text: "数据共享"
    }],
    slideButtons0: [{
      type: 'warn',
      text: '取消协助',
      data: 'remove0'
    }],
    slideButtons1: [{
      type: 'warn',
      text: '取消共享',
      data: 'remove1'
    }],
    list0: [],
    list1: []
  },
  tabChange(e) {
    var index = e.detail.index;

    switch (index) {
      case 0:
        this.setData({ tab: 0 });

        this.getList();
        break;

      case 1:
        this.setData({ tab: 1 });

        this.getList();
        break;
    }
  },
  getUser: function () {
    var that = this;

    app.api_request('user/current','',function(res){
      that.setData({api_user: res.data});
    });
  },
  getList: function(){
    var that = this;

    var tab = this.data.tab;
    var url = tab == 0 ? 'freight/share_from' : 'freight/share_to';

    app.api_request(url,'',function(res){
      if(res.out == 1)
      {
        for(var i in res.data)
        {
          res.data[i].freight_share_end_time = app.date('yyyy年MM月dd日', res.data[i].freight_share_end_time);
        }

        if(tab == 0)
        {
          that.setData({list0: res.data});
        }
        else
        {
          that.setData({list1: res.data});
        }
      }
      else
      {
        if (tab == 0) {
          that.setData({ list0: [] });
        }
        else {
          that.setData({ list1: [] });
        }
      }
    });
  },
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
    var freight_share_id = e.target.dataset.id;
    var index = e.target.dataset.index;

    switch (action) {
      case 'remove0':
        wx.showModal({
          title: '提示',
          content: '确定取消协助该用户发货吗？',
          success(res) {
            if (res.confirm) {
              app.api_request('freight/unshare', { freight_share_id: freight_share_id }, function (res) {
                var list0 = that.data.list0;

                list0.splice(index, 1);

                that.setData({ list0: list0 });
              });
            }
          }
        });
        break;

      case 'remove1':
        wx.showModal({
          title: '提示',
          content: '确定取消共享发货数据给该用户吗？',
          success(res) {
            if (res.confirm) {
              app.api_request('freight/unshare', { freight_share_id: freight_share_id }, function (res) {
                var list1 = that.data.list1;

                list1.splice(index,1);

                that.setData({list1: list1});
              });
            }
          }
        });
        break;
    }
  },
  codeChange: function(e){
    // console.log(e);
    this.setData({formCode: e.detail.value});
  },
  showDialog: function()
  {
    this.setData({
      dialogShow: true
    });
  },
  tapDialogButton(e) {
    var that = this;
    var index = e.detail.index;
    var text = e.detail.item.text;

    if(text == '确定'){
      if(!that.data.formCode)
      {
        wx.showToast({
          title: '协助码不能为空',
          icon: 'none'
        });

        return ;
      }

      app.api_request('freight/share', { code: that.data.formCode},function(res){
        if(res.out == 1)
        {
          var update = {};
          var index = that.data.list1.length;

          res.data.freight_share_end_time = app.date('yyyy年MM月dd日', res.data.freight_share_end_time);

          update['list1['+index+']'] = res.data;

          that.setData(update);
        }
        else
        {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      });
    }

    that.setData({
      formCode: '',
      dialogShow: false
    });
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
    var that = this;

    app.check_login(function(res){
      if(res.out == 1)
      {
        that.setData({ api_user: res.data });
      }
    });

    this.getList();
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