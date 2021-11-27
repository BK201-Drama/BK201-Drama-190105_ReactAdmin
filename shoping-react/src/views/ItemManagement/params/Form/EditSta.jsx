import React, { Component } from 'react'
import { Form, Input } from 'antd'

const { Item } = Form
export default class EditDym extends Component {
  render() {
    const { initSta } = this.props
    return (
      <Form
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 6 }}
        initialValues={{
          static: initSta
        }}
      >
        <Item name="static" label="static param">
          <Input ref={input => this.props.setStaticParamName(input)}/>
        </Item>
      </Form>
    )
  }
}
