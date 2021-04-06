var wxCharts = require('../../ext/wxcharts-min.js');
var lineChart = null;
const app = getApp();

Page({
  data: {
    date : null,
    tabIndex : 0,
  },
 
  onLoad: function () {
    creatChart
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

  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

  createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 10; i++) {
      categories.push('2016-' + (i + 1));
      data.push(Math.random() * (20 - 10) + 10);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },

  updateData: function () {
    var simulationData = this.createSimulationData();
    var series = [{
      name: '成交量1',
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(2) + '万';
      }
    }];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series
    });
  }
})

function creatChart() {
  var windowWidth = 320;
  try {
    var res = wx.getSystemInfoSync();
    windowWidth = res.windowWidth;
  } catch (e) {
    console.error('getSystemInfoSync failed!');
  }

  var simulationData = this.createSimulationData();
  lineChart = new wxCharts({
    canvasId: 'lineCanvas',
    type: 'line',
    categories: simulationData.categories,
    animation: true,
    // background: '#f5f5f5',
    series: [{
      name: '成交量1',
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(2) + '万';
      }
    }],
    xAxis: {
      disableGrid: true
    },
    yAxis: {
      title: '成交金额 (万元)',
      format: function (val) {
        return val.toFixed(2);
      },
      min: 0
    },
    width: windowWidth,
    height: 200,
    dataLabel: false,
    dataPointShape: true,
    extra: {
      lineStyle: 'curve'
    }
  });
}

