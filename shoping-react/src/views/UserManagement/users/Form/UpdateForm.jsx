import React, { Component } from 'react'
import { Form, Input } from 'antd'

export default class UpdateForm extends Component {
  render() {
    const { Email, Mobile } = this.props
    return (
      <Form
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 4 }}
        initialValues={{
          Email: Email,
          Mobile: Mobile
        }}
      >
        <Form.Item label="Email" name="Email">
          <Input ref={input => this.props.setEmail(input)}/>
        </Form.Item>
        <Form.Item label="Mobile" name="Mobile">
          <Input ref={input => this.props.setMobile(input)}/>
        </Form.Item>
      </Form>
    )
  }
}
