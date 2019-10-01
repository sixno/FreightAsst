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
    api_user_id: app.api_user('id'),
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
    }
  },
  cancelSearch: function(){
    console.log('cancelSearch');
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
          res.data[i].type = app.api_user('id') != res.data[i].to_user_id ? 0 : 1;
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