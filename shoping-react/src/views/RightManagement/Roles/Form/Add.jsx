import React, { Component } from 'react'
import { Form, Input } from 'antd'
const { Item } = Form

export default class Add extends Component {
  render() {
    return (
      <Form
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 6 }}
      >
        <Item name="roleName" label="role name">
          <Input ref={input => this.props.addRoleName(input)}/>
        </Item>

        <Item name="description" label="description">
          <Input ref={input => this.props.addDescription(input)}/>
        </Item>
      </Form>
    )
  }
}
