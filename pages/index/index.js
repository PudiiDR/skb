var util = require('../../utils/util.js')

var wxCharts = require('../../ext/wxcharts-min.js');
var lineChart = null;
const app = getApp();

const revenue_overall_url = require('../../config').revenue_overall_url;

var getData = function (that) {
  wx.request({
    url: revenue_overall_url + that.data.date,
    header: {
      'content-type': 'application/json', // 默认值
      'token' : app.globalData.user_token.token
    },
    data: {},
    success: function (res) {
      console.log(res);
      var result = res.data;
      if (result.code == '操作成功') {
        var data = result.data;
        that.setData({
          tableData: result.msg
        })
      }
      else {
        wx.showToast({
          title: '请求数据失败',
          image: "../../images/icon-no.png",
          mask: true,
          duration: 1000,
        })
      }
    }
  });
  var categories = [];
  var data = [];
  for (var i = 0; i < 31; i++) {
    categories.push('' + (i + 1));
    data.push(Math.random() * (20 - 10) + 10);
  }
  // data[4] = null;
  return {
    categories: categories,
    data: data
  }
}

Page({
  data: {
    date: util.formatDate(new Date()),
    tabIndex : 0,
    tableData : {
      "everyDayTotal": 0, 
      "lastMonthTotal": 0, 
      "lastYearTotal": 0, 
      "yearTotal": 0, 
      "monthTotal": 0
    }
  },
 
  onLoad: function () {

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var charData = getData(this);
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: charData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '月度收入趋势',
        data: charData.data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '收入',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      enableScroll: false,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    });
    this.updateData();
  },

  tabChanged: function (e) {
    console.log(e.target.dataset);
    this.setData({
      tabIndex: e.target.dataset.index,
    })
  },

  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        // return category + '日' + item.name + ':' + item.data
        return category + '日收入:\r\r\r' + item.data
      }
    });
  },

  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + '日收入:\r\r\r' + item.data
      }
    });
  },

  updateData: function () {
    var charData = getData(this);
    var series = [{
      name: '月度收入趋势',
      data: charData.data,
      format: function (val, name) {
        return val.toFixed(2) + '万';
      }
    }];
    lineChart.updateData({
      categories: charData.categories,
      series: series
    });
  }
})


