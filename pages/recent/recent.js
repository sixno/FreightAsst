// pages/recent/recent.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    type: 'all',
    status: '',
    search_value: '',
    tabs: [{
      text: "全部"
    },
    {
      text: "收货"
    },
    {
      text: "发货"
    },
    {
      text: "订单"
    }]
  },
  paymentOK: function(e){
    var that = this;
    var freight_id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;

    wx.showModal({
      title: '是否确认收款',
      content: '确认收款后该记录将进入发货列表，请确认钱款已实际到账',
      success: function (res) {
        console.log(res);

        if (res.confirm) {
          app.api_request('freight/mod',{freight_id: freight_id,payment: 1},function(res){
            if(res.out == 1)
            {
              that.setData({['list['+index+'].payment']: 1});
            }
          });
        }
      }
    });
  },
  receiveGoods: function (e) {
    var that = this;
    var freight_id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;

    wx.showModal({
      title: '是否确认收货',
      content: '确认收货后，该记录从收货列表中移除',
      success: function (res) {
        console.log(res);

        if (res.confirm) {
          app.api_request('freight/mod', { freight_id: freight_id, status: 2 }, function (res) {
            if (res.out == 1) {
              that.setData({ ['list[' + index + '].status']: 2 });
            }
          });
        }
      }
    });
  },
  delFreight: function (e) {
    var that = this;
    var freight_id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;

    wx.showModal({
      title: '是否删除该货运单',
      content: '请注意，删除后不可恢复',
      success: function (res) {
        console.log(res);

        if (res.confirm) {
          app.api_request('freight/del', { freight_id: freight_id}, function (res) {
            if (res.out == 1) {
              that.setData({ ['list[' + index + '].deleted']: 1 });
            }
          });
        }
      }
    });
  },
  tabChange(e) {
    var index = e.detail.index;

    switch (index) {
      case 0:
        this.setData({ tab: 0, type: 'all', status: '' });

        this.getList('-');
        break;

      case 1:
        this.setData({ tab: 1, type: 'receive', status: '1' });

        this.getList('0');
        break;

      case 2:
        this.setData({ tab: 2, type: 'send', status: '0' });

        this.getList('0');
        break;

      case 3:
        this.setData({ tab: 3, type: 'order', status: '0' });

        this.getList('0');
        break;
    }
  },
  search: function (value) {
    return new Promise((resolve, reject) => {
      // setTimeout(() => {
      //   resolve([{ text: '搜索结果', value: 1 }, { text: '搜索结果2', value: 2 }])
      // }, 200)
      reject('');
    })
  },
  selectResult: function (e) {
    console.log('select result', e.detail)
  },
  searchInput: function (e) {
    var line = this.data.tab == 0 ? '-' : '0';
    var search = e.detail.value;

    this.setData({ search_value: search });

    this.getList(line);
  },
  clearSearchInput: function (e) {
    var line = this.data.tab == 0 ? '-' : '0';

    this.setData({ search_value: '' });

    this.getList(line);
  },
  cancelSearch: function (e) {
    var line = this.data.tab == 0 ? '-' : '0';

    this.setData({search_value: ''});

    this.getList(line);
  },
  getList: function(line,type,status,search)
  {
    var that = this;

    if (that.data.get_list) return;

    that.setData({ get_list: 1 });

    if (typeof (line) == 'undefined') line = '-';
    if (typeof (type) == 'undefined') type = that.data.type;
    if (typeof (status) == 'undefined') status = that.data.status;
    if (typeof (search) == 'undefined') search = that.data.search_value;

    that.setData({ search_value: search });

    app.api_request('freight/list?line=' + line, { type: type, status: status, search: search }, function (res) {
      var data = {};
      var list = [];

      if(res.out == 1)
      {
        for(var i in res.data)
        {
          res.data[i].create_time = app.date('yyyy-MM-dd hh:mm:ss', res.data[i].create_time);
        }

        if (that.data.list && line != '-' && line != '0') {
          var index = that.data.list.length;

          for (var i in res.data) {
            data['list[' + (Number(index) + Number(i)) + ']'] = res.data[i];
          }
        }
        else {
          data.list = res.data;
        }
      }
      else
      {
        if (line == '-' || line == '0')
        {
          data.list = [];
        }
      }

      data.line = res.line;
      data.get_list = 0;

      that.setData(data);
    });
  },
  reachEnd: function (e) {
    // console.log(e);
    var line = this.data.line;

    if (line.indexOf('end') !== -1) return;

    this.getList(line);
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
  onTabItemTap(item) {
    this.getList(this.data.tab == 0 ? '-' : '0');
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