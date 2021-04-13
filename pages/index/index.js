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

var monthChartData ;
var yearChartData ;

function dealData(monthTopData, yearTopData) {
  monthChartData  = { "cloumn": [], "data": [] };
  yearChartData = { "cloumn": [], "data": [] };
  for (var index in monthTopData) {
    var month = monthTopData[index];
    monthChartData.cloumn.push(month.name);
    monthChartData.data.push(month.monthTotalTop);
  }
  console.log('月度前十数据:' + JSON.stringify(monthChartData));
  for (var index2 in yearTopData) {
    var year = yearTopData[index2];
    
    yearChartData.cloumn.push(year.name);
    yearChartData.data.push(year.monthTotalTop);
  }
  console.log('年度前十数据:' + JSON.stringify(yearChartData));
}

function setOption(chart, current) {
  var currentData = (current == 0 ? monthChartData : yearChartData);
  const option = {
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
        data: currentData.cloumn,
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
        data: currentData.data,
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      }
    ]
  };
  chart.setOption(option);
}


Page({
  data: {
    date: util.formatDateWithZero(new Date()),
    tabIndex: 1,
    radioIndex : 0,
    tableData: {
      "everyDayTotal": 0,
      "lastMonthTotal": 0,
      "lastYearTotal": 0,
      "yearTotal": 0,
      "monthTotal": 0
    },
    tableData2: {
      "erpMonthAdd": 0,
      "erpYearActive": 0,
      "erpYearAdd": 0,
      "erpMonthActive": 0,
      "erpTotal": 0
    },
    items: [
      { name: '月度', value: '0', checked: 'true' },
      { name: '年度', value: '1' }
    ],
    ec: {
      // onInit: initChart
      lazyLoad: true
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
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    wx_request(this, revenue_project_url + encodeURI(this.data.date), app.globalData.user_token.token, function(data) {
      page.setData({
        tableData2: data
      });
      var monthTop = data.monthTop;
      var yearTop = data.yearTop;
      dealData(monthTop, yearTop);

      page.ecComponent.init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        setOption(chart, 0);

        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        page.chart = chart;

        page.setData({
          isLoaded: true,
          isDisposed: false
        });

        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return chart;
      });
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
    wx_request(this, revenue_overall_url + encodeURI(this.data.date), app.globalData.user_token.token, function (serverData) {
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

    wx_request(this, revenue_project_url + encodeURI(this.data.date), app.globalData.user_token.token, function (data) {
      page.setData({
        tableData2: data
      });
      var monthTop = data.monthTop;
      var yearTop = data.yearTop;
      dealData(monthTop, yearTop);

      page.ecComponent.init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        setOption(chart, page.data.radioIndex);

        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        page.chart = chart;

        page.setData({
          isLoaded: true,
          isDisposed: false
        });

        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return chart;
      });
    }); 
  },

  listenCheckboxChange: function (e) {
    //打印对象包含的详细信息
    var current = e.detail.value;
    this.setData({
      radioIndex: current
    })
   
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, current);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
    

  }

})


