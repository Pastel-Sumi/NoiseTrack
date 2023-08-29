import ReactEcharts from "echarts-for-react"
import React, { useEffect } from "react";
import * as echarts from 'echarts';

//var echarts = require('echarts');
var element = document.getElementById('echarts-for-react ');
// var myChart = echarts.init(chartDom, 'dark', {
//     renderer: 'svg'
//   });
var options;
function randomData() {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    return {
      name: now.toString(),
      value: [
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
        Math.round(value)
      ]
    };
  }
let data = [];
let now = new Date(1997, 9, 3);
let oneDay = 24 * 3600 * 1000;
let value = Math.random() * 1000;
for (var i = 0; i < 1000; i++) {
  data.push(randomData());
}
options = {
    title: {
        text: 'Dynamic Data & Time Axis'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          params = params[0];
          var date = new Date(params.name);
          return (
            date.getDate() +
            '/' +
            (date.getMonth() + 1) +
            '/' +
            date.getFullYear() +
            ' : ' +
            params.value[1]
          );
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: 'Fake Data',
          type: 'line',
          showSymbol: false,
          data: data
        }
      ]
    };
  setInterval(function () {
    for (var i = 0; i < 5; i++) {
      data.shift();
      data.push(randomData());
    }
    echarts.setOption({
        series: [
          {
            data: data
          }
        ]
      });
  }, 1000);

export function Chart() {
  return (
    <ReactEcharts
      option={options}
      style={{ width: "600px", height: "300px" }}
    ></ReactEcharts>
  )
}
