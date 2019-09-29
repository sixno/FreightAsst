// pages/goods/favor.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_value: '',
    get_list: 0,
    slideButtons: [{
      type: 'warn',
      text: '取消收藏',
      data: 'unfavor'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      search: this.search.bind(this)
    });

    this.getList('-', '');
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
    // console.log(e);

    var search = e.detail.value;

    this.getList('-', search);
  },
  clearSearchInput: function (e) {
    this.getList('-', '');
  },
  getList: function (line, search) {
    var that = this;

    if (that.data.get_list) return;

    that.setData({ get_list: 1 });

    if (typeof (line) == 'undefined') line = '-';
    if (typeof (search) == 'undefined') search = that.data.search_value;

    that.setData({ search_value: search });

    app.api_request('goods/favor_list?line=' + line, search ? { search: search } : '', function (res) {
      var data = {};
      var list = [];

      if (that.data.list && line != '-') {
        var index = that.data.list.length;

        for (var i in res.data) {
          data['list[' + (Number(index) + Number(i)) + ']'] = res.data[i];
        }
      }
      else {
        data.list = res.data;
      }

      data.line = res.line;
      data.get_list = 0;

      that.setData(data);
    });
  },
  slideButtonTap: function (e) {
    var that = this;
    var action = e.detail.data;
    var goods_id = e.target.dataset.id;
    var index = e.target.dataset.index;

    switch (action) {
      case 'unfavor':
        wx.showModal({
          title: '提示',
          content: '确定从列表中取消收藏吗？',
          success(res) {
            if (res.confirm) {
              app.api_request('goods/unfavor', { goods_id: goods_id }, function (res) {
                if(res.out == 1){
                  that.setData({ ['list[' + index + '].deleted']: 1});
                }
              });
            }
          }
        });
        break;
    }
  },
  slideShow: function (e) {
    this.setData({ ['list[' + e.target.dataset.index + '].slideShow']: 1 });
  },
  slideHide: function (e) {
    var that = this;

    setTimeout(function () {
      that.setData({ ['list[' + e.target.dataset.index + '].slideShow']: 0 });
    }, 500)
  },
  itemTap: function (e) {
    var data = e.target.dataset;

    if (!this.data.list[data.index].slideShow) {
      wx.navigateTo({
        url: '/pages/goods/item?goods_id=' + data.id,
      });
    }
  },
  reachEnd: function (e) {
    // console.log(e);
    var line = this.data.line;

    if (line.indexOf('end') !== -1) return;

    this.getList(line);
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
      that.getList('-', '');
    });
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