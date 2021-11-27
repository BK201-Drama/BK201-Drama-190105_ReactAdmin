import React, { Component } from 'react'
import { Select } from 'antd'

const { Option } = Select

export default class SelectRole extends Component {

  myOption = (arr) => {
    return arr.map(item => {
      return <Option value={`${item.roleName}`}>{`${item.roleName}`}</Option>
    })
  }

  handleChange = (value) => {
    // console.log(`selected ${value}`)
    this.props.getRole(value)
  }
  
  render () {
    return (
      <>
        <Select defaultValue={this.props.defaultValue} style={{ width: 120 }} onChange={this.handleChange}>
          {this.myOption(this.props.arr)}
        </Select>
      </>
    )
  }
}