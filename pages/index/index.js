var util = require('../../utils/util.js');
var wxCharts = require('../../ext/wxcharts-min.js');
import * as echarts from '../../ext/ec-canvas/echarts';
var wx_request = require('../../ext/wx-request.js');


const app = getApp();
const revenue_overall_url = require('../../config').revenue_overall_url;
const revenue_project_url = require('../../config').revenue_project_url;

var lineChart = null;
let chart = null;
var windowWidth = 320;

try {
  var res = wx.getSystemInfoSync();
  windowWidth = res.windowWidth;
} catch (e) {
  console.error('getSystemInfoSync failed!');
}

var drawLineChart = function (serverData) {
  var chartData = serverData.everyDayTotal;
  var categories = [];
  var data = [];
  for (var i = 1; i < 32; i++) {
    categories.push('' + (i + 1));
    data.push((chartData && chartData.length > i) ? chartData[i] : 0);
  }

  lineChart = new wxCharts({
    canvasId: 'lineCanvas',
    type: 'line',
    categories: categories,
    animation: true,
    background: '#f5f5f5',
    series: [{
      name: '月度收入趋势',
      data: data,
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
}

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    color: ['#37a2da', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      // data: ['热度', '正面', '负面']
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '项目收入',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: [300, 270, 340, 344, 300, 320, 310],
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      }
    ]
  };
  chart.setOption(option);
  return chart;
}

Page({
  data: {
    date: util.formatDateWithZero(new Date()),
    tabIndex: 1,
    tableData: {
      "everyDayTotal": 0,
      "lastMonthTotal": 0,
      "lastYearTotal": 0,
      "yearTotal": 0,
      "monthTotal": 0
    },
    items: [
      { name: '月度', value: '0', checked: 'true' },
      { name: '年度', value: '1' }
    ],
    ec: {
      onInit: initChart
    }
  },

  onLoad: function () {
    // getRemoteData(this);
    var page = this;
    wx_request(this, revenue_overall_url + encodeURI(this.data.date), app.globalData.user_token.token,      function (data) {
      page.setData({
        tableData: data
      });
      drawLineChart(data);
    });

    wx_request(this, revenue_project_url + encodeURI(this.data.date), app.globalData.user_token.token, function() {
      console.log('succ')
    });
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value + " 00:00:00"
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
    // console.log(lineChart.getCurrentDataIndex(e));
    if (!lineChart) {
      return;
    }
    console.log(lineChart);
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        // return category + '日' + item.name + ':' + item.data
        return category + '日收入:\r\r\r' + item.data
      }
    });
  },

  // touchHandler: function (e) {
  //   lineChart.scrollStart(e);
  // },
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
    var page = this;
    wx_request(this, revenue_overall_url + this.data.date, app.globalData.user_token.token, function (serverData) {
      page.setData({
        tableData: serverData
      });
      var chartData = serverData.everyDayTotal;
      var categories = [];
      var data = [];
      for (var i = 1; i < 32; i++) {
        categories.push('' + (i + 1));
        data.push((chartData && chartData.length > i) ? chartData[i] : 0);
      }

      var series = [{
        name: '月度收入趋势',
        data: data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }];
      lineChart.updateData({
        categories: categories,
        series: series
      });
    });   
  },

  listenCheckboxChange: function (e) {
    console.log('radio-group中的radio选中或者取消是我被调用');
    //打印对象包含的详细信息
    console.log(e);

  }

})


