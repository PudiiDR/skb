import * as echarts from '../../ext/ec-canvas/echarts';
var util = require('../../utils/util.js');
var wx_request = require('../../ext/wx-request.js');
const resources_my_url = require('../../config').resources_my_url;
const carType = require('../../config').CAR_TYPE;


//index.js
//获取应用实例
const app = getApp();
var pieData1, pieData2, pieData3;

function parsePieData(serverData) {
  pieData1 =[{}];
  pieData2 = [{}]; 
  pieData3 = [{}];
  pieData1.push({ "name": "三证合格," + serverData.auditCount, value: serverData.auditCount});
  pieData1.push({ "name": "不合格," + serverData.noAuditCount, value: serverData.noAuditCount});


  for (var value of serverData.carTypeCount) {
    var name = carType[value.type];
    if(name) {
      pieData2.push({ "name": name + "," + value.carTypeCount, "value": value.carTypeCount });
    }
  }

  for (var value of serverData.carLengthCount) {
    var carlength = value.carlength;
    if (carlength) {
      pieData3.push({ "name": carlength + "米," + value.carLengthCount, "value": value.carLengthCount });
    }
  }
}

function setOption(chart, pieData) {
 
  const option = {
    backgroundColor: "#ffffff",
    
    color: ["#91F2DE", "#32C5E9", "#67E0E3", "#FF9F7F", "#FFDB5C", "#37A2DA"],
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],
      data: pieData,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };
  chart.setOption(option);
}


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    date: util.formatDateWithZero(new Date()),
    tabIndex: 0,
    user:null,
    ec: {
      lazyLoad: true
    },
    tableData : null

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var page = this;
    this.setData({
      user: app.globalData.user_token.user
    });

    this.ecComponent1 = this.selectComponent('#mychart-dom-pie1');
    this.ecComponent2 = this.selectComponent('#mychart-dom-pie2');
    this.ecComponent3 = this.selectComponent('#mychart-dom-pie3');
    // this.ecComponent3 = this.selectComponent('#mychart-dom-pie3');

    this.updateData();

  },

  updateData: function() {
    var page = this;
    wx_request(this, resources_my_url + encodeURI(this.data.date), app.globalData.user_token.token, function (data) {
      page.setData({
        tableData: data
      });
      parsePieData(data);

      page.ecComponent1.init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        setOption(chart, pieData1);

        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        page.chart = chart;

        page.setData({
          isLoaded: true,
          isDisposed: false
        });
        return chart;
      });
      page.ecComponent2.init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        setOption(chart, pieData2);

        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        page.chart = chart;

        page.setData({
          isLoaded: true,
          isDisposed: false
        });
        return chart;
      });

      page.ecComponent3.init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        setOption(chart, pieData3);

        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        page.chart = chart;

        page.setData({
          isLoaded: true,
          isDisposed: false
        });
        return chart;
      });

    });
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
      date: e.detail.value + " 00:00:00"
    });
    this.updateData();
  },

  tabChanged: function (e) {
    // console.log(e.target.dataset);
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
          console.log('用户点击确定');
          wx.removeStorage({
            key: "user_token",
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
