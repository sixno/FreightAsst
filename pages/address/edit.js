// pages/address/edit.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    error: '',
    formData: {},
    rules: [{
      name: 'address_name',
      rules: [{ required: true, message: '联系人必填' }],
    }, {
      name: 'address_tel',
      rules: [{ required: true, message: '联系人手机号码必填' }, { mobile: true, message: '联系人手机号码格式不对' }],
    }, {
      name: 'address_detail',
      rules: [{ required: true, message: '详细地址必填' }],
    }],
    name: '',
    tel: '',
    region: ['', '', ''],
    detail: ''
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      'formData.address_province': e.detail.value[0],
      'formData.address_city': e.detail.value[1],
      'formData.address_county': e.detail.value[2]
    })
  },
  formInputChange: function (e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  submitForm: function () {
    var that = this;

    this.selectComponent('#form').validate((valid, errors) => {console.log(that.data.formData);
      console.log('valid', valid, errors)
      if (!valid) {return;
        const firstError = Object.keys(errors)
        if (firstError.length) {


        }
      } else {
        console.log(that.data.formData);
        var data = {};

        for(var i in that.data.formData)
        {
          data[(i != 'address_id' ? i.substr(8) : i)] = that.data.formData[i];
        }

        app.api_request('address/mod',data,function(res){
          if(res.out == 1)
          {
            if(app.dat_page){
              var index = null;
              var update_data = {};

              for(var i in app.dat_page.data.list) {
                if(app.dat_page.data.list[i].id == res.data.id) index = i;
              }

              update_data['list[' + index + ']'] = res.data;

              app.dat_page.setData(update_data);

              // app.dat_page = null;
            }

            wx.navigateBack({});
          }
          else
          {
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

    app.api_request('address/item',options,function(res){
      if(res.out == 1)
      {
        var data = {};

        data.formData = {};

        data.formData.address_id = res.data.id;
        data.formData.address_name = res.data.name;
        data.formData.address_tel = res.data.tel;
        data.formData.address_province = res.data.province;
        data.formData.address_city = res.data.city;
        data.formData.address_county = res.data.county;
        data.formData.address_detail = res.data.detail;

        data.name = res.data.name;
        data.tel = res.data.tel;
        data.region = [res.data.province,res.data.city,res.data.county];
        data.detail = res.data.detail;

        that.setData(data);
      }
      // console.log(res);
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
    if (app.dat_page) {
      app.dat_page = null;
    }
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