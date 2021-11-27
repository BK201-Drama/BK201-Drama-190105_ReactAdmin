import React, { Component } from 'react'
import { Form, Input } from 'antd'
const { Item } = Form

export default class Edit extends Component {

  render() {
    const {roleName, description} = this.props
    return (
      <Form
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 6 }}
        initialValues={{
          roleName: roleName,
          description: description
        }}
      >
        <Item name="roleName" label="role name">
          <Input ref={input => this.props.setRoleName(input)}/>
        </Item>

        <Item name="description" label="description">
          <Input ref={input => this.props.setDescription(input)}/>
        </Item>
      </Form>
    )
  }
}
