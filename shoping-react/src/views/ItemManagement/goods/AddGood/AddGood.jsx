import React, { Component } from 'react'
import { Steps, Form, Input, Button, Cascader } from 'antd'
import * as GoodsAPI from '../../../../api/item-management/goods/goods' 

import UploadImg from './UploadImg/UploadImg'
import SuccessResult from './SuccessResult/SuccessResult'

const { Step } = Steps
const { TextArea } = Input
const { Item } = Form

// cat_name -> label
// cat_id -> value
var transCategories = (category) => {
  var cat = category.map((item) => {
    if(item.children === undefined){
      return {
        value: item.cat_id,
        label: item.cat_name
      }
    }
    return {
      value: item.cat_id,
      label: item.cat_name,
      children: transCategories(item.children)
    }
  })
  return cat
}

export default class AddGood extends Component {
  state = {
    stepState: 0,
    status: 0,
    categories: [],

    // 用于级联选择分类的数组字符串存储
    catId: null
  }

  async componentWillMount () {
    var categories = await GoodsAPI.getCategories()
    var temp = transCategories(categories.data)
    this.setState({
      categories: temp
    })
  }

  render() {
    return (
      <>
        <Steps current={this.state.status} style={{marginBottom: 70}} hidden={this.state.status === 5}>
          <Step title="基本信息"/>
          <Step title="商品参数"
            onClick={() => {
              this.setState({
                stepState: 1
              })
            }}
          />
          <Step title="商品属性"/>
          <Step title="商品图片"/>
          <Step title="商品内容"/>
        </Steps>

        {/* ======================================================================================== */}

        <Form 
          hidden={false} 
          onFinish={async(values) => {
            console.log(values)

            var res = await GoodsAPI.addCategory({
              ...values,
              goods_cat: `${values.goods_cat.toString()}`
            })
            console.log(res)
          }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          <Item hidden={!(this.state.status === 0)} label="商品名称" name="goods_name">
            <Input/>
          </Item>
          <Item hidden={!(this.state.status === 0)} label="商品价格" name="goods_price">
            <Input/>
          </Item>
          <Item hidden={!(this.state.status === 0)} label="商品重量（kg）" name="goods_weight">
            <Input/>
          </Item>
          <Item hidden={!(this.state.status === 0)} label="商品数量" name="goods_number">
            <Input/>
          </Item>
          <Item hidden={!(this.state.status === 0)} label="商品分类" name="goods_cat">
            <Cascader
              options={this.state.categories}
              placeholder="Please select"
              onChange={async (value) => {
                await this.setState({
                  catId: value.toString()
                })
                console.log(this.state.catId)
              }}
            />
          </Item>

          <Item hidden={!(this.state.status === 0)}>
            <Button 
              onClick={() => {
                this.setState({
                  status: this.state.status + 3
                })
              }}
              type="primary"
            >next</Button>
          </Item>

          {/* ======================================================================================== */}

          <Item hidden={!(this.state.status === 3)} name="pics">
            <UploadImg/>
          </Item>

          <Item hidden={!(this.state.status === 3)}>
            <Button 
              onClick={() => {
                this.setState({
                  status: this.state.status + 1
                })
              }}
              type="primary"
            >next</Button>

            <Button 
              onClick={() => {
                this.setState({
                  status: this.state.status - 3
                })
              }}
            >ahead</Button>
          </Item>

          <Item hidden={!(this.state.status === 4)} name="goods_introduce">
            <TextArea 
              rows={10}
              showCount={true}
              maxLength={100}
              label="商品简介"
              size="large"
              placeholder="请输入你的评价，最好不要少于10个字噢！"
            />
          </Item>

          <Item hidden={!(this.state.status === 4)} >
            <Button type="primary" htmlType="submit" 
              onClick={() => {
                this.setState({
                  status: this.state.status + 1
                })
              }}>提交
            </Button>
            <Button 
              onClick={() => {
                this.setState({
                  status: this.state.status - 1
                })
              }}
            >ahead</Button>
          </Item>

          {/* ======================================================================================== */}

          <Item hidden={!(this.state.status === 5)} style={{marginLeft: 400}}>
            <SuccessResult routeTo={() => {
              this.props.history.push('/goods')
            }}/>
          </Item>

        </Form>
      </>
    )
  }
}
