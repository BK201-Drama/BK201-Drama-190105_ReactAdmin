import React, { Component } from 'react'
import { Button } from 'antd'

export default class LinkButton extends Component {
  render() {
    return (
      <Button {...this.props} shape="circle" size={'middle'} />
    )
  }
}
