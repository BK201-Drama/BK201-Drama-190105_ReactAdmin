import React, { Component } from 'react'
import { Form, Input, Cascader } from 'antd'

import * as CategoriesAPI from '../../../../api/item-management/categories/categories' 

const { Item } = Form

const deepClone = (obj) => {
  var res = Array.isArray(obj) === false ? {} : []
  if (obj && typeof(obj) === 'object') {
    for (var key in obj) {
    	if(obj[key] && typeof(obj[key]) === 'object') {
        res[key] = deepClone(obj[key])
      } else {
        res[key] = obj[key]
      }
    }
    return res
  }
}

const setLabelAndValue = (obj) => {
  for (let item in obj) {
    obj[item] = {
      ...obj[item],
      value: `${[obj[item].cat_id, obj[item].cat_level]}`,
      label: obj[item].cat_name
    }
    if(obj[item]?.children){
      setLabelAndValue(obj[item].children)
    }
  }
}

export default class Add extends Component {
  state = {
    myClassification: []
  }
  
  async componentWillMount () {
    var list = await CategoriesAPI.getCategoriesList(2)
    var temp = deepClone(list.data)
    setLabelAndValue(temp)

    await this.setState({
      myClassification: temp
    })
  }

  render() {
    return (
      <>
        <Form>
          <Item name="categoryName" label="category name">
            <Input ref={data => this.props.setName(data)}/>
          </Item>
          <Item name="classification" label="classification">
            <Cascader options={this.state.myClassification} ref={data => this.props.setClassification(data)} changeOnSelect={true}/>
          </Item>
        </Form>
      </>
    )
  }
}
