import React, { Component } from 'react'
import * as categoriesAPI from '../../../api/item-management/categories/categories'
import { CheckCircleTwoTone, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Table, Space, Tag, Card, Modal, Button } from 'antd'
import LinkButton from '../../../Components/LinkButton/LinkButton'
import Update from './Form/Update'
import Add from './Form/Add'

// 设置key
const setKey = (categoriesList) => {
  for(let item in categoriesList){
    categoriesList[item] = {
      ...categoriesList[item],
      key: `${categoriesList[item].cat_id}`
    }
    if(categoriesList[item]?.children){
      setKey(categoriesList[item].children)
    }
  }
}

// 深拷贝
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

export default class Categories extends Component {
  state = {
    categoriesList: [{
      cat_id: 1,
      cat_name: '大家电',
      cat_pid: 0,
      cat_level: 0,
      cat_deleted: false,
      children: [
        {
          cat_id: 45,
          cat_name: '冰箱',
          cat_pid: 1,
          cat_level: 1,
          cat_deleted: false,
          children: [
            {
                cat_id: 56,
                cat_name: '对开门冰箱',
                cat_pid: 45,
                cat_level: 2,
                cat_deleted: false
            }
          ]
        }
      ]
    }],
    ListInfo: {
      type: 3
    },
    isShowEditModal: false,
    isShowDeleteModal: false,
    isShowAddModal: false,

    selectedData: null
  }

  changeColor = (record) => {
    if(record.cat_level === 0){
      return 'blue'
    }else if(record.cat_level === 1){
      return 'green'
    }else{
      return 'brown'
    }
  }

  async componentWillMount () {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'cat_name',
        key: 'cat_name',
        align: 'center'
      },{
        title: '是否有效',
        dataIndex: 'is_can',
        key: 'is_can',
        align: 'center',
        render: (text, record) => <CheckCircleTwoTone />
      },{
        title: '级别',
        dataIndex: 'cat_level',
        key: 'cat_level',
        align: 'center',
        render: (text, record) => {
          return (
            <Tag color={this.changeColor(record)}>{`${record.cat_level + 1}级`}</Tag>
          )
        }
      },{
        title: 'action',
        align: 'center',
        render: (text, record) => {
          return (
            <Space size="middle">
              <LinkButton
                icon={<EditOutlined />}
                type="primary"
                onClick={async() => {
                  await this.setState({
                    selectedData: record,
                    isShowEditModal: true
                  })
                  console.log(this.state.selectedData)
                }}
              />
              <LinkButton
                icon={<DeleteOutlined />}
                type="danger"
                onClick={async() => {
                  await this.setState({
                    selectedData: record,
                    isShowDeleteModal: true
                  })
                }}
              />
            </Space>
          )
        }
      }
    ]
  }

  async componentDidMount() {
    var res = await categoriesAPI.getCategoriesList({type: 3})
    
    var list = deepClone(res.data)
    setKey(list)

    await this.setState({
      categoriesList: list
    })
  }

  render() {
    return (
      <Card
        extra={
          <Button
            icon={<PlusOutlined/>} 
            onClick={() => {
              this.setState({
                isShowAddModal: true
              })
            }}
          />
        }
      >
        <Table columns={this.columns} dataSource={this.state.categoriesList} filterMode={'menu'}/>
        
        {/* 编辑 */}
        <Modal
          title="Edit"
          visible={this.state.isShowEditModal === true}
          onOk={async() => {
            var res = await categoriesAPI.updateCategory(this.state.selectedData.cat_id, {
              cat_name: this.UpdateCategoriesName.state.value
            })

            var list = await categoriesAPI.getCategoriesList(3)
            var tmp = deepClone(list.data)
            setKey(tmp)

            await this.setState({
              isShowEditModal: false,
              categoriesList: tmp
            })
            // console.log(res)
          }}

          onCancel={async() => {
            await this.setState({
              isShowEditModal: false
            })
          }}
          // 如果没有这一行，就会导致上一个也会被保存
          destroyOnClose={true}
        >
          <Update 
            Name = {this.state.selectedData === null ? "NeedInit " : this.state.selectedData.cat_name}
            UpdateCategoriesName = {(cat_name) => {
              this.UpdateCategoriesName = cat_name
            }}
          />
        </Modal>

        {/* 删除 */}
        <Modal
          title="delete"
          visible={this.state.isShowDeleteModal === true}
          onOk={async () => {
            var res = await categoriesAPI.deleteCategory(this.state.selectedData.cat_id)
            console.log(res)

            var resq = await categoriesAPI.getCategoriesList()
            var list = deepClone(resq.data)
            setKey(list)
            await this.setState({
              isShowDeleteModal: false,
              categoriesList: list
            })
          }}
          onCancel={async () => {
            await this.setState({
              isShowDeleteModal: false
            })
          }}
        >
            do you'd like to delete this category?
        </Modal>

        <Modal
          title="add category"
          visible={this.state.isShowAddModal === true}
          onOk={async () => {
            // 获取标题了
            // value: [cat_id, cat_level]
            // 我们拿到的是字符串，因此我们需要转换数字二维数组
            console.log(this.classification.state.value)

            // 转换过程
            var res_value = []
            for(let item of this.classification.state.value){
              console.log(item)
              item = item.split(',').map((index) => {
                return index * 1
              })
              res_value.push(item)
            }

            var res = await categoriesAPI.addCategory({
              cat_pid: res_value[1][0],
              cat_name: this.categoryName.state.value,
              cat_level: res_value[1][1] + 1
            })
            console.log(res)

            var resq = await categoriesAPI.getCategoriesList()
            var list = deepClone(resq.data)
            setKey(list)
            await this.setState({
              isShowAddModal: false,
              categoriesList: list
            })
          }}
          onCancel={async() => {
            await this.setState({
              isShowAddModal: false
            })
          }}
        >
          <Add
            setClassification = {(data) => { this.classification = data }}
            setName = {(data) => { this.categoryName = data }}
          />
        </Modal>
      </Card> 
    )
  }
}
