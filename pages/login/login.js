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
        var token = result.data.token;
        var user = result.data.user;
        wx.setStorage({
          key: "token",
          data: token,
        });
        wx.setStorage({
          key: "user",
          data: user,
        });
        app.globalData.bmcUser = user;
        console.log(app);
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
      key: 'user',
      success: function (res) {
        console.log('获取当前用户:' + res.data);
        if (res.data) {
          app.globalData.bmcUser = res.data;
          wx.switchTab({
            url: '../resource/index'
          });
        }
      }
    });

    // wx.getStorage({
    //   key: 'token',
    //   success: function (res) {
    //     console.log('登录界面载入:' + res);
    //     if (res.data) {
    //       wx.switchTab({
    //         url: '../resource/index'
    //       })
    //     }
    //   }
    // })
  }
})