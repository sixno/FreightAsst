// pages/index/index.js
const app = getApp();

Page({
  data: {

  },
  getUser: function () {
    var that = this;

    if(app.api_user('id'))
    {
      that.setData({ api_user: app.api_user() });
    }
    else
    {
      app.api_request('user/current','',function(res){
        if(res.out == 1)
        {
          that.setData({api_user: res.data});
        }
      });
    }
  },
  onLoad: function () {
    // this.getUser();
  },
  onShow: function () {
    // var that = this;

    // app.refresh_page(function () {
    //   that.getUser();
    // });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
