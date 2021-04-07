// pages/login/login.js
const login_url = require('../../config').login_url;
const app = getApp();

var login = function (that) {
  wx.request({
    url: login_url,

    data: {
      userName: that.data.userName,
      password: that.data.password
    },

    success: function (res) {
      console.log(res);
      var result = res.data;
      
      if (result.code == 0) {
        var user_token = result.data;
        wx.setStorage({
          key: "user_token",
          data: user_token,
        });
        app.globalData.user_token = user_token;
        wx.switchTab({
          url: '../index/index'
        });
      }
      else {
        wx.showToast({
          title: '登录失败',
          image: "../../images/icon-no.png",
          mask: true,
          duration: 1000,
        })
      }
    }
  })
}

Page({
  data: {
    userName: '',
    password: ''
  },

  bindNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },

  bindPwdInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  bindInputLogin: function (e) {
    login(this)
  },

  formLogin: function (e) {
    login(this)
  },

  onLoad: function (e) {
    wx.getStorage({
      key: 'user_token',
      success: function (res) {
        console.log('获取当前用户:' + res.data);
        if (res.data) {
          app.globalData.user_token = res.data;
          wx.switchTab({
            url: '../index/index'
          });
        }
      }
    });
  }
})