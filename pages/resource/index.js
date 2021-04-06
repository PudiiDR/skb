import * as echarts from '../../ext/ec-canvas/echarts';
//index.js
//获取应用实例
const app = getApp();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#fff",
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],

    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        console.log(params);
        return params;
      }
    },
    legend: {

      data: ['月度收入趋势']
    },
    grid: {
      containLabel: true
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      x: 'center',
      type: 'value'
    },
    series: [{
      name: '月度收入趋势',
      type: 'line',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 99]
    }]
  };

  chart.setOption(option);
  return chart;
}


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    date: null,
    tabIndex: 0,
    user:null,
    ec: {
      onInit: initChart
    }

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log(app);
    
    this.setData({
      user: app.globalData.bmcUser
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  tabChanged: function (e) {
    console.log(e.target.dataset);
    this.setData({
      tabIndex: e.target.dataset.index,
    })
  },

  logout : function() {
    wx.showModal({
      title: '提示',
      content: '确认退出',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.removeStorage({ key: "token" });
          wx.removeStorage({
            key: "user",
            success: function (res) {
              console.log("退出登录");
              wx.showToast({
                title: '退出成功',
                duration: 2000,
                success : function() {
                  wx.navigateTo({
                    url: '../login/login'
                  });
                }
              });
            }
          });

        } else {
          console.log('用户点击取消')
        }

      }
    })


    
  }
})
