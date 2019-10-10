// pages/freight/item.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    rules1: [{
      name: 'freight_to_name',
      rules: [{ required: true, message: '收货人必填' }],
    }, {
      name: 'freight_to_tel',
      rules: [{ required: true, message: '联系方式必填' }],
    }, {
      name: 'freight_to_address',
      rules: [{ required: true, message: '地址必填' }],
    }],
    rules2: [{
      name: 'freight_from_name',
      rules: [{ required: true, message: '发货人必填' }],
    }, {
      name: 'freight_from_tel',
      rules: [{ required: true, message: '联系方式必填' }],
    }, {
      name: 'freight_from_address',
      rules: [{ required: true, message: '地址必填' }],
    }],
    paymentItems: [
      { name: '未付款', value: '0', checked: true },
      { name: '已付款/无需付款', value: '1' }
    ],
  },
  paymentOK: function (e) {
    var that = this;
    var freight_id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '是否确认收款',
      content: '确认收款后该记录将进入发货列表，请确认钱款已实际到账',
      success: function (res) {
        console.log(res);

        if (res.confirm) {
          app.api_request('freight/mod', { freight_id: freight_id, payment: 1 }, function (res) {
            if (res.out == 1) {
              that.setData({ payment: 1 });

              var cps = getCurrentPages();

              for (var i in cps)
              {
                if(cps[i].route == 'pages/recent/recent')
                {
                  for (var j in cps[i].data.list) {
                    if (cps[i].data.list[j].id == freight_id) {
                      cps[i].setData({ ['list[' + j + ']']: res.data });
                    }
                  }
                }
              }
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
        if (res.confirm) {
          app.api_request('freight/mod', { freight_id: freight_id, status: 2 }, function (res) {
            if (res.out == 1) {
              that.setData({ status: 2 });

              var cps = getCurrentPages();

              for (var i in cps) {
                if (cps[i].route == 'pages/recent/recent') {
                  for (var j in cps[i].data.list) {
                    if (cps[i].data.list[j].id == freight_id) {
                      cps[i].setData({ ['list[' + j + ']']: res.data });
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  },
  selectAddress1: function (e) {
    app.dat_page = this;

    wx.navigateTo({
      url: '/pages/address/pick?type=receive'
    })
  },
  clearAddress1: function (e) {
    var that = this;

    var update = {};

    update.address = {};
    update.address_lock = false;

    update['formData.freight_to_address_id'] = '0';
    update['formData.freight_to_name'] = '';
    update['formData.freight_to_tel'] = '';
    update['formData.freight_to_address'] = '';
    update['formData.freight_to_zipcode'] = '';

    that.setData(update);
  },
  selectAddress2: function (e) {
    app.dat_page = this;

    wx.navigateTo({
      url: '/pages/address/pick?type=send'
    });
  },
  clearAddress2: function (e) {
    var that = this;

    var update = {};

    update.address = {};
    update.address_lock = false;

    update['formData.freight_from_address_id'] = '0';
    update['formData.freight_from_name'] = '';
    update['formData.freight_from_tel'] = '';
    update['formData.freight_from_address'] = '';
    update['formData.freight_from_zipcode'] = '';

    that.setData(update);
  },
  paymentChange: function (e) {
    var val = e.detail.value;

    this.setData({ ['formData.freight_payment']: val });
  },
  formInputChange: function (e) {
    const { field } = e.currentTarget.dataset;
    var update = {};

    if (field.indexOf('freight_content_detail_') != -1) {
      var index = field.substr(23);

      update['contents[' + index + '].detail'] = e.detail.value;
    }

    update[`formData.${field}`] = e.detail.value;

    this.setData(update);
  },
  submitForm: function () {
    var that = this;

    this.selectComponent('#form').validate((valid, errors) => {
      // console.log(that.data.formData);
      console.log('valid', valid, errors)
      if (!valid) {
        return;
        const firstError = Object.keys(errors)
        if (firstError.length) {


        }
      } else {
        // console.log(that.data.formData);return ;
        var data = {};

        for (var i in that.data.formData) {
          data[(i != 'freight_id' ? i.substr(8) : i)] = that.data.formData[i];
        }

        app.api_request('freight/mod', data, function (res) {
          if (res.out == 1) {
            that.setData(res.data);
          }
          else {
            wx.showToast({
              icon: 'none',
              title: res.msg
            });
          }
        });

        // wx.showToast({
        //   title: '校验通过'
        // });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options) return;

    var that = this;

    app.api_request('freight/item', options, function (res) {
      if (res.out == 1) {
        wx.setNavigationBarTitle({
          title: res.data.type == 1 ? '收货单详情' : '发货单详情'
        });

        res.data.formData = {};
        res.data.formData.freight_id = res.data.id;

        if (res.data.type == 2 && res.data.from_confirm != 1)
        {
          res.data.formData.freight_payment = 0;
        }

        that.setData(res.data);

        if(res.data.from_confirm != 1 || res.data.to_confirm != 1){
          app.api_request('address/def', '', function (address) {
            if (address.out == 1) {
              var update = {};

              update.address = address.data;
              update.address_lock = true;

              if(res.data.type == 1)
              {
                update['formData.freight_to_address_id'] = address.data.id;
                update['formData.freight_to_name'] = address.data.name;
                update['formData.freight_to_tel'] = address.data.tel;
                update['formData.freight_to_address'] = address.data.full;
                update['formData.freight_to_zipcode'] = address.data.zipcode;
                update['formData.freight_to_confirm'] = 1;
              }
              else
              {
                update['formData.freight_from_address_id'] = address.data.id;
                update['formData.freight_from_name'] = address.data.name;
                update['formData.freight_from_tel'] = address.data.tel;
                update['formData.freight_from_address'] = address.data.full;
                update['formData.freight_from_zipcode'] = address.data.zipcode;
                update['formData.freight_from_confirm'] = 1;
              }

              that.setData(update);
            }
          });
        }
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
    return app.share_options();
  }
})