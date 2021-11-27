import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'

import * as loginAPI from '../../api/login/login'
import { Layout, Button } from 'antd'
const { Header } = Layout


class TopBar extends Component {

  render() {
    return (
      <div>
        <Header style={{ background: '#fff', padding: 0 }}>
          <div style={{width: 1220, display: 'inline-block'}}></div>
          <Button onClick={() => {
            loginAPI.logOut()
            sessionStorage.removeItem('token')
            this.props.history.push('/')
          }}>Log Out</Button>
        </Header>
      </div>
    )
  }
}

export default withRouter(TopBar);