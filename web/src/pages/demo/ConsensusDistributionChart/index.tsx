/**
 * Created by Jacob Xie on 10/20/2021
 */

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const options: Highcharts.Options = {
  title: {
    text: 'My chart'
  },
  series: [{
    type: 'line',
    data: [1, 2, 3]
  }]
}

export default () => {

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}
