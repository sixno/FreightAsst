// pages/freight/add.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {freight_from_confirm: 1},
    rules: [{
      name: 'freight_from_name',
      rules: [{ required: true, message: '发货人必填' }],
    }, {
      name: 'freight_from_tel',
      rules: [{ required: true, message: '联系方式必填' }],
    }, {
      name: 'freight_from_address',
      rules: [{ required: true, message: '地址必填' }],
    }],
    contents: [],
    address: {},
    address_lock: false
  },
  detailMinus: function (e) {
    var that = this;
    var index = Number(e.target.dataset.index);
    var value = Number(e.target.dataset.value);
    var contents = that.data.contents;

    if (typeof (contents[index]) !== 'undefined') {
      if (value > 0){
        var update = {['contents['+index+'].detail']: value - 1};

        update['formData.freight_content_detail_' + index] = value - 1;

        that.setData(update);
      }
    }
  },
  detailPlus: function (e) {
    var that = this;
    var index = Number(e.target.dataset.index);
    var value = Number(e.target.dataset.value);
    var contents = that.data.contents;

    if (typeof (contents[index]) !== 'undefined') {
      var update = { ['contents[' + index + '].detail']: value + 1 };

      update['formData.freight_content_detail_' + index] = value + 1;

      that.setData(update);
    }
  },
  detailChange: function (e) {
    var that = this;
    var index = Number(e.target.dataset.index);
    var value = Number(e.detail.value);
    var contents = that.data.contents;

    if (value < 0) value = 0;

    if (typeof (contents[index]) !== 'undefined') {
      var update = { ['contents[' + index + '].detail']: value };
      update['formData.freight_content_detail_' + index] = value;

      that.setData(update);
    }
  },
  addGoods: function(){
    app.dat_page = this;

    wx.navigateTo({
      url: '/pages/goods/pick?favor=0'
    });
  },
  addCustomGoods: function(){
    var that = this;
    var index = that.data.contents.length;

    var update = { ['contents[' + index + ']']: { goods_id: '0', name: '', model: '', unit: '', detail: '' } };

    update['formData.freight_content_goods_id_' + index] = '0';
    update['formData.freight_content_name_' + index] = '';
    update['formData.freight_content_model_' + index] = '';
    update['formData.freight_content_unit_' + index] = '';
    update['formData.freight_content_detail_' + index] = '';

    that.setData(update);
  },
  removeGoods: function (e) {
    var formData = this.data.formData;

    var contents = this.data.contents;

    var index = e.target.dataset.index;

    delete (formData['freight_content_goods_id_' + index]);
    delete (formData['freight_content_name_' + index]);
    delete (formData['freight_content_model_' + index]);
    delete (formData['freight_content_unit_' + index]);
    delete (formData['freight_content_detail_' + index]);

    contents.splice(index, 1);

    this.setData({ formData: formData, contents: contents });
  },
  selectAddress: function (e){
    app.dat_page = this;

    wx.navigateTo({
      url: '/pages/address/pick?type=send'
    });
  },
  clearAddress: function (e){
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
          if (i.indexOf('freight_content_') != -1 && i.indexOf('freight_content_detail_') == -1) continue;

          if (i.indexOf('freight_content_detail_') == -1) {
            data[(i != 'freight_id' ? i.substr(8) : i)] = that.data.formData[i];
          }
          else {
            var index = i.substr(23);

            if (!that.data.formData[i]) continue;

            var content = {};

            content.goods_id = that.data.formData['freight_content_goods_id_' + index];
            content.name = that.data.formData['freight_content_name_' + index];
            content.model = that.data.formData['freight_content_model_' + index];
            content.unit = that.data.formData['freight_content_unit_' + index];
            content.detail = that.data.formData[i];

            if (data.content) {
              data.content.push(content);
            }
            else {
              data.content = [content];
            }
          }
        }

        if (data.content) {
          data.content = JSON.stringify(data.content);
        }
        else {
          wx.showToast({ title: '货运内容不能为空', icon: 'none' });

          return;
        }

        app.api_request('freight/add', data, function (res) {
          if (res.out == 1) {
            wx.redirectTo({
              url: '/pages/freight/item?freight_id=' + res.data.id
            })
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
    var that = this;

    app.api_request('address/def','',function(res){
      if(res.out == 1)
      {
        var update = {};

        update.address = res.data;
        update.address_lock = true;

        update['formData.freight_from_address_id'] = res.data.id;
        update['formData.freight_from_name'] = res.data.name;
        update['formData.freight_from_tel'] = res.data.tel;
        update['formData.freight_from_address'] = res.data.full;
        update['formData.freight_from_zipcode'] = res.data.zipcode;
        update['formData.freight_from_confirm'] = 1;

        that.setData(update);
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

  }

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})