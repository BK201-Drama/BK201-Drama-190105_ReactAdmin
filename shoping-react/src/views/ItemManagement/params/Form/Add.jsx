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
          add: initDyn
        }}
      >
        <Item name="add" label="Param name">
          <Input ref={input => this.props.addDynamicParamName(input)}/>
        </Item>
      </Form>
    )
  }
}
