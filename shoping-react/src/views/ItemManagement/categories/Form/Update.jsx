import React, { Component } from 'react'
import { Form, Input } from 'antd'

export default class Update extends Component {
  render() {
    const { Name } = this.props
    return (
      <Form
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 4 }}
        initialValues={{
          Name: Name
        }}
      >
        <Form.Item name="Name" label="Category">
          <Input 
            ref={input => this.props.UpdateCategoriesName(input)}
          />
        </Form.Item>
      </Form>
    )
  }
}
