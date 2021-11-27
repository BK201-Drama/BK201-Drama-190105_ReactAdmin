import React, { Component } from 'react'
import { Form, Input } from 'antd'

export default class AddForm extends Component {
  render() {
    return (
      <Form
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 5 }}
      >
        <Form.Item label="Username">
          <Input ref={input => this.props.setUsername(input)}/>
        </Form.Item>
        <Form.Item label="Password">
          <Input ref={input => this.props.setPassWord(input)}/>
        </Form.Item>
        <Form.Item label="Email">
          <Input ref={input => this.props.setEmail(input)}/>
        </Form.Item>
        <Form.Item label="Mobile">
          <Input ref={input => this.props.setMobile(input)}/>
        </Form.Item>
      </Form>
    )
  }
}