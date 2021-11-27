import React, { Component } from 'react'
import * as echarts from "echarts"
import * as ReportAPI from "../../api/data-statisitc/reports"


// 表格组件
export default class Chart extends Component {
  state = {
    options: {
      title: {
        text: "用户来源"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#E9EEF3"
          }
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          boundaryGap: false
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ]
    }
  }

  async componentDidMount(){
    const res = await ReportAPI.report()
  
    var myChart = echarts.init(document.getElementById("main"))
    if(res.meta.status !== 200){
      console.log("error")
    }
    Object.assign(this.state.options, res.data)
    myChart.setOption(res.data)
  }
  
  render() {
    return (
      <div id={'main'} style={{width: 750, height: 400, marginLeft: 250}}></div>
    )
  }
}
