function wx_request(page, remoteUrl, token, callBack) {
  wx.request({
    url: remoteUrl,
    // method: 'POST',
    header: {
      // 'content-type': 'application/json', // 默认值
      // 'content-type': 'application/x-www-form-urlencoded',
      
      'token': token
    },
    
    data: {},
    success: function (res) {
      console.log(res);
      var result = res.data;
      switch (result.code) {
        case '0':   
          if (callBack) {
            callBack(result.data);
          }
          break;
        case '-1': 
          wx.removeStorage({
            key: "user_token",
            success: function (res) {
              console.log("退出登录");
              wx.showToast({
                title: '退出成功',
                duration: 2000,
                success: function () {
                  wx.navigateTo({
                    url: '../login/login'
                  });
                }
              });
            }
          });
          break;
        default :
          wx.showToast({
            title: '请求数据失败',
            image: "../../images/icon-no.png",
            mask: true,
            duration: 1000,
          })
          break;
      };

    }
  });
}
module.exports = wx_request;