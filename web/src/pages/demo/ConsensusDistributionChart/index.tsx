/**
 * Created by Jacob Xie on 10/20/2021
 *
 * https://www.highcharts.com/demo/bullet-graph
 */

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import bullet from "highcharts/modules/bullet"


// 初始化 bullet 模块（必须！）
bullet(Highcharts)

// options
const options: Highcharts.Options = {
  chart: {
    // 横向展示
    inverted: true,
  },
  title: {
    // 标题
    text: 'My chart'
  },
  xAxis: {
    // x轴注释
    categories: ['<span class="hc-cat-title">Revenue</span><br/>U.S. $ (1,000s)']
  },
  yAxis: {
    // y轴视觉分隔
    gridLineWidth: 0,
    // y轴色彩条
    plotBands: [
      {
        from: 0,
        to: 150,
        color: '#666'
      },
      {
        from: 150,
        to: 225,
        color: '#999'
      },
      {
        from: 225,
        to: 9e9,
        color: '#bbb'
      }
    ],
  },
  series: [
    {
      // 数据类型
      type: 'bullet',
      data: [
        {
          y: 275,
          target: 250,
        },
      ]
    }
  ],
  tooltip: {
    // 提示
    pointFormat: '<b>{point.y}</b> (with target at {point.target})'
  }
}


export default () => {
  return (
    <HighchartsReact highcharts={Highcharts} options={options} />
  )
}
