import React, { Component } from 'react'
import { Result } from 'antd'
import LinkButton from '../../../../../Components/LinkButton/LinkButton'
import { ArrowRightOutlined } from '@ant-design/icons'

export default class SuccessResult extends Component {
  
  render() {
    return (
      <Result
        status="success"
        title="Success to create a category in your database!"
        subTitle="If you want to go back the page which has a categories list, please click 【back】"
        extra={[
          <LinkButton
            icon={<ArrowRightOutlined />}
            onClick={this.props.routeTo}
          />
        ]}
      />
    )
  }
}
