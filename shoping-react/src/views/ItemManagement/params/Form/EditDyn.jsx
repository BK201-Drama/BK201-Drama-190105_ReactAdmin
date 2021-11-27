import React, { Component } from 'react'
import { Form, Input } from 'antd'

const { Item } = Form
export default class EditDyn extends Component {
  render() {
    const { initDyn } = this.props
    return (
      <Form
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 6 }}
        initialValues={{
          dynamic: initDyn
        }}
      >
        <Item name="dynamic" label="dynamic param">
          <Input ref={input => this.props.setDynamicParamName(input)}/>
        </Item>
      </Form>
    )
  }
}