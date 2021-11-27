import React, { Component } from 'react'
import { Cascader, Form, Input } from 'antd'
import cityData from '../../../../plugin/cityData'

const { Item } = Form

export default class UpdateForm extends Component {
  render() {
    return (
      <>
        <Form
          wrapperCol={{ span: 16 }}
          labelCol={{ span: 4 }}
        >
          <Item name="cityData" label="city">
            <Cascader options={cityData} ref={data => this.props.setCityData(data)}/>
          </Item>
          <Item name="detailedAddress" label="address">
            <Input ref={input => this.props.setDetailedAddress(input)}/>
          </Item>
        </Form>
      </>
    )
  }
}
