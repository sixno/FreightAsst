// pages/goods/add.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    rules: [{
      name: 'goods_cover',
      rules: [{ required: true, message: '货品缩略图必需' }],
    }, {
      name: 'goods_name',
      rules: [{ required: true, message: '货品名称必填' }],
    }, {
      name: 'goods_content',
      rules: [{ required: true, message: '货品描述必填' }],
    }],
    files: [],
    sizes: [{ model: '', unit: '' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cps = getCurrentPages();

    if (cps.length >= 2) {
      app.refresh_show = cps[cps.length - 2].route;
    }

    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    });
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },
  uplaodFile(files) {
    return new Promise((resolve, reject) => {
      app.api_upload('cover', files.tempFilePaths[0],function(res){console.log(res);
        if (res.out == 1) {
          resolve({ urls: [res.data.file] });
        }
        else {
          reject('上传失败');
        }
      });
    });
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    // console.log('upload success', e.detail)
    this.setData({ ['formData.goods_cover']: e.detail.urls[0] });console.log(this.data.formData);
  },
  uploadDelete(e) {
    // console.log('upload delete',e.detail)
    this.setData({ ['formData.goods_cover']: '' });
  },
  addSize: function(e) {
    var update = {};

    update['sizes['+this.data.sizes.length+']'] = {model: '',unit: ''};

    this.setData(update);
  },
  removeSize: function(e) {
    // console.log('rmoveSize',e);

    var formData = this.data.formData;

    var sizes = this.data.sizes;

    var index = e.target.dataset.index;

    delete (formData['goods_size_model_' + index]);
    delete (formData['goods_size_unit_' + index]);

    sizes.splice(index,1);

    this.setData({formData: formData,sizes: sizes});
  },
  formInputChange: function (e) {
    const { field } = e.currentTarget.dataset;
    var update = {};

    if(field.indexOf('goods_size_model_') != -1)
    {
      var index = field.substr(17);

      update['sizes[' + index + '].model'] = e.detail.value;
    }

    if (field.indexOf('goods_size_unit_') != -1) {
      var index = field.substr(16);

      update['sizes[' + index + '].unit'] = e.detail.value;
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
          if (i.indexOf('goods_size_unit_') != -1) continue;

          if(i.indexOf('goods_size_model_') == -1){
            data[(i != 'goods_id' ? i.substr(6) : i)] = that.data.formData[i];
          }
          else
          {
            var index = i.substr(17);

            if (!that.data.formData[i] || !that.data.formData['goods_size_unit_' + index]) continue;

            if(data.size)
            {
              data.size.push({ model: that.data.formData[i], unit: that.data.formData['goods_size_unit_' + index] });
            }
            else
            {
              data.size = [{ model: that.data.formData[i], unit: that.data.formData['goods_size_unit_' + index] }];
            }
          }
        }

        if(data.size)
        {
          data.size = JSON.stringify(data.size);
        }
        else
        {
          wx.showToast({title: '货品规格请至少填写一项',icon: 'none'});

          return ;
        }

        app.api_request('goods/add', data, function (res) {
          if (res.out == 1) {
            wx.navigateBack({});
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.refresh_show = 'pages/goods/list';
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