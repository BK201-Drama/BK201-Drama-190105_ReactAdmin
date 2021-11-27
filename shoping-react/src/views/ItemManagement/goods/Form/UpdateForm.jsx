import React, { Component } from 'react'
import { Form, Input } from 'antd'

const { Item } = Form
export default class UpdateForm extends Component {
  render() {
    return (
      <Form
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 6 }}
      >
        <Item name="goods_name" label="goods name">
          <Input ref={input => this.props.setGoodsName(input)}/>
        </Item>

        <Item name="goods_price" label="goods price">
          <Input ref={input => this.props.setGoodsPrice(input)}/>
        </Item>

        <Item name="goods_weight" label="goods weight">
          <Input ref={input => this.props.setGoodsWeight(input)}/>
        </Item>
      </Form>
    )
  }
}
