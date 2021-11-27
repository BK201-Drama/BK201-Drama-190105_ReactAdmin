import React, { Component } from 'react'
import './Login.css'
import img from '../../assets/img/bg.png'
import { Form, Input, Button, notification } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import * as loginAPI from '../../api/login/login'

export default class Login extends Component {
  onFinish = async (values) => {

    const resp = await loginAPI.login(values)

    if (resp.meta.status < 300) {
      this.props.history.push('/welcome')

      // 成功登录之后的侧边栏
      notification['success']({
        message: 'Success to login!',
        description: 'welcome to the system!',
        duration: 1
      })
    } else if (resp.meta.status >= 400) {
      console.log('error')
    }
  }
  
  render(){
    return (
      <div>
        <div>
          <img className={"myImg"} src={img}/>
        </div>
        <div className={"FormBox"}>
          <div className={"myForm"}>
            <h1 style={{textAlign: 'center', color: '#778'}}>Login</h1>
            <Form
              name="normal_login"
              className={"login-form"}
              initialValues={{ username: 'admin', password: '123456' }}
              onFinish={this.onFinish}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
              >
                <Input prefix={<UserOutlined className={"site-form-item-icon"} />} placeholder="Username" key="username"/>
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input
                  prefix={<LockOutlined className={"site-form-item-icon"} />}
                  type="password"
                  placeholder="Password"
                  key="password"
                />
              </Form.Item>
        
              <Form.Item>
                <Button type="primary" htmlType="submit" className={"login-form-button"}>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}