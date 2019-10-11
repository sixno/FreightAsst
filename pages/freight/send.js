// pages/freight/send.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {freight_status: 1},
    rules: [],
    express_index: 0,
    company_lock: true,
    buttonText: '确定发货'
  },
  scanFN: function () {
    var that = this;

    wx.scanCode({
      success: function (res) {
        // console.log(res)
        that.setData({ freight_no: res.result,['formData.freight_freight_no']: res.result });
      },
      fail: function () {
        wx.showToast({
          title: '扫描失败',
          icon: 'none'
        })
      }
    });
  },
  companyChange: function (e) {
    var that = this;
    var index = e.detail.value;
    var express_list = that.data.express_list;

    if(express_list && express_list[index])
    {
      var update = {};

      if (express_list[index].code == '')
      {
        update.company_lock = false;
        update.freight_company = '';
        update['formData.freight_freight_cd'] = '';
        update['formData.freight_freight_company'] = '';
      }
      else
      {
        update.company_lock = true;
        update.freight_company = express_list[index].name;
        update['formData.freight_freight_cd'] = express_list[index].code;
        update['formData.freight_freight_company'] = express_list[index].name;
      }

      that.setData(update);

      wx.setStorageSync('express_index', index);
    }
  },
  formInputChange: function (e) {
    const { field } = e.currentTarget.dataset;
    var update = {};

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

        if(!data.freight_no)
        {
          wx.showToast({
            title: '运单号不能为空',
            icon: 'none'
          });

          return ;
        }

        if (!data.freight_company) {
          wx.showToast({
            title: '快递公司不能为空',
            icon: 'none'
          });

          return;
        }

        app.api_request('freight/mod', data, function (res) {
          if (res.out == 1) {
            app.update_cp({
              'pages/recent/recent': function(cp){
                for (var i in cp.data.list) {
                  if (cp.data.list[i].id == data.freight_id) {
                    cp.setData({ ['list[' + i + ']']: res.data });
                  }
                }
              },
              'pages/freight/item': function(cp){
                cp.setData(res.data);
              }
            });

            // var cps = getCurrentPages();

            // for (var i in cps) {
            //   if (cps[i].route == 'pages/recent/recent') {
            //     for (var j in cps[i].data.list) {
            //       if (cps[i].data.list[j].id == data.freight_id) {
            //         cps[i].setData({ ['list[' + j + ']']: res.data });
            //       }
            //     }
            //   }

            //   if (cps[i].route == 'pages/freight/item') {
            //     cps[i].setData(res.data);
            //   }
            // }

            wx.navigateBack();
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
    var express_index = wx.getStorageSync('express_index') || 0;

    that.setData({from: options.from});

    if(options.freight_id)
    {
      that.setData({['formData.freight_id']: options.freight_id});
    }

    if(options.freight_no)
    {
      wx.setNavigationBarTitle({
        title: '修改运单'
      });

      var ini = {};
      ini.freight_no = options.freight_no;
      ini.freight_company = options.freight_company;
      ini.buttonText = '确定修改';
      
      ini['formData.freight_freight_no'] = options.freight_no;
      ini['formData.freight_freight_cd'] = options.freight_cd;
      ini['formData.freight_freight_company'] = options.freight_company;

      that.setData(ini);
    }

    app.api_request('freight/cd_list','',function(res){
      if(res.out == 1)
      {
        var update = {};

        res.data.unshift({code:'',name:'手工填写'});

        update.express_list = res.data;

        if (options.freight_cd === undefined)
        {
          if(express_index != 0 && res.data[express_index])
          {
            update.express_index = express_index;

            update.company_lock = true;
            update.freight_company = res.data[express_index].name;
            update['formData.freight_freight_cd'] = res.data[express_index].code;
            update['formData.freight_freight_company'] = res.data[express_index].name;
          }
        }
        else if (options.freight_cd)
        {
          for(var i in res.data)
          {
            if (res.data[i].code == options.freight_cd)
            {
              update.express_index = i;

              update.company_lock = true;
              update.freight_company = res.data[i].name;
              update['formData.freight_freight_cd'] = res.data[i].code;
              update['formData.freight_freight_company'] = res.data[i].name;
            }
          }
        }

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
})