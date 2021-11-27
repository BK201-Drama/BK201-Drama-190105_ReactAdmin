import React, { Component } from 'react'
import { CheckCircleTwoTone, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Table, Space, Tag, Card, Modal, Button, Tabs, Cascader, Alert, notification } from 'antd'

import LinkButton from '../../../Components/LinkButton/LinkButton'

import EditDyn from './Form/EditDyn'
import EditSta from './Form/EditSta'

import Add from './Form/Add'

import * as ParamAPI from '../../../api/item-management/params/params'

const { TabPane } = Tabs;

// 设置key
const setKey = (ParamList) => {
  for(let item in ParamList){
    ParamList[item] = {
      ...ParamList[item],
      key: `${ParamList[item].attr_id}`
    }
    if(ParamList[item]?.children){
      setKey(ParamList[item].children)
    }
  }
}

// 设置标签和值
const setLabelAndValue = (obj) => {
  for (let item in obj) {
    obj[item] = {
      ...obj[item],
      value: obj[item].cat_id,
      label: obj[item].cat_name
    }
    if(obj[item]?.children){
      setLabelAndValue(obj[item].children)
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

export default class Params extends Component {
  state = {
    dataSource: [],
    cascaderData: [],
    dataSource_table: [],
    tabKey: "many",
    isAddBtnDefault: false,
    selectedData: null,
    attr_vals: [],
    expandedRowKeys: [],

    isShowEditModal: false,
    isShowDeleteModal: false,
    isShowAddModal: false
  }

  // cas的值发生变化
  onChange_Cas = async (value, selectedOptions) => {
    if(selectedOptions.length === 0 || !selectedOptions){
      this.setState({
        isAddBtnDefault: false
      })
      return
    }
    // 根据选择的东西判断是否有孩子节点，再来判断是否发送给服务器
    if(selectedOptions[selectedOptions.length - 1].children === undefined){
      await this.setState({
        cascaderData: value
      })
      console.log(this.state.cascaderData)
      if(this.state.cascaderData.length <= 1){
        return
      }
      if(this.state.cascaderData !== []){
        var res = await ParamAPI.getParamList(this.state.cascaderData[this.state.cascaderData.length - 1], {sel: this.state.tabKey})
        var temp = deepClone(res.data)
        setKey(temp)
        this.setState({
          dataSource_table: temp,
          isAddBtnDefault: true
        })
        if(temp.length === 0){
          this.setState({
            isAddBtnDefault: false
          })
        }
      }
    }
  }

  // tab的值发生变化
  onChange_Tabs = async (key) => {
    if(this.state.cascaderData === [] || this.state.cascaderData === null){
      return
    }
    var res = await ParamAPI.getParamList(this.state.cascaderData[this.state.cascaderData.length - 1], {sel: key})
    var temp = deepClone(res.data)
    setKey(temp)
    console.log(temp)
    this.setState({
      dataSource_table: temp,
      tabKey: key
    })
  }

  // 控制表的展开为手风琴式展开
  controlExpanding = (expanded, record) => {
    let temp = []
    if(expanded){
      temp.push(record.key)
    }
    var temp_ = record.attr_vals.split(" ")
    this.setState({
      expandedRowKeys: temp,
      selectedData: record,
      attr_vals: temp_
    })
    console.log(this.state.attr_vals)
  }

  // 编辑对话框按下Ok按钮的触发
  editOnOk = async () => {
    var temp = this.state.tabKey === "many" ? this.DynamicParamName.state.value : this.StaticParamName.state.value
    await this.setState({
      isShowEditModal: false,
      dataSource_table: this.state.dataSource_table.map(item => {
        if(item.attr_id === this.state.selectedData.attr_id){
          return {
            ...item,
            attr_name: temp
          }
        }else{
          return item
        }
      })
    })

    var res = await ParamAPI.updateParam({
      id: this.state.selectedData.cat_id,
      attrId: this.state.selectedData.attr_id,
      attr_name: temp,
      attr_sel: this.state.tabKey
    })

    if(res.meta.status === 200){
      notification['success']({
        message: 'Success to edit!',
        description: 'Do something you like',
        duration: 1
      })
    }else{
      notification['error']({
        message: 'error to edit!',
        description: 'please do it again',
        duration: 1
      })
    }

  }

  // 删除对话框按下Ok按钮的触发
  deleteOnOk = async() => {
    // 对于删除操作，我们使用filter就可以了，不需要操作deepClone
    await this.setState({
      isShowDeleteModal: false,
      dataSource_table: this.state.dataSource_table.filter((item) => {
        return item.attr_id !== this.state.selectedData.attr_id
      })
    })
    var res = await ParamAPI.deleteParam(this.state.selectedData.cat_id, this.state.selectedData.attr_id)
    if(res.meta.status === 200){
      notification['success']({
        message: 'Success to delete!',
        description: 'Do something you like',
        duration: 1
      })
    }else{
      notification['error']({
        message: 'error to delete!',
        description: 'please do it again',
        duration: 1
      })
    }
  }

  // 生成标签
  renderTag = (temp) => {
    return <>
      {
        temp.map(item => {
          return <Tag color="#2db7f5">{item}</Tag>
        })
      }
    </>
  }

  async componentWillMount () {
    this.columns = [
      {
        title: 'parameter name',
        dataIndex: 'attr_name',
        key: 'parameterName',
        align: 'center'
      },{
        title: 'option',
        dataIndex: 'option',
        key: 'option',
        align: 'center',
        render: (text, record) => {
          return (
            <Space>
              <LinkButton 
                icon={<EditOutlined/>}
                type="primary"
                onClick={async () => {
                  await this.setState({
                    selectedData: record,
                    isShowEditModal: true
                  })
                }}
              />

              <LinkButton 
                icon={<DeleteOutlined/>}
                type="danger"
                onClick={async () => {
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

    var res = await ParamAPI.getCategoriesList(3)
    var temp = deepClone(res.data)
    setLabelAndValue(temp)
    if(temp === []){
      await this.setState({
        isAddBtnDefault: false
      })
    }
    await this.setState({
      dataSource: temp
    })
  }

  async componentDidMount () {
    
  }


  render() {
    return (
      <>
        <Alert 
          message="在下面的级联选择中选择参数" 
          description="注意：只允许为第三级分类设置相关参数"
          type="warning"
          showIcon
        />
        <Card
          extra={
            <Cascader 
              style={{marginRight: 1000}}
              options={this.state.dataSource}
              onChange={this.onChange_Cas}
              changeOnSelect={true}
            />
          }
        >

          <Tabs 
            defaultActiveKey="many"
            onChange={this.onChange_Tabs}
            tabBarExtraContent={
              <Button 
                icon={<PlusOutlined/>} 
                onClick={async() => {
                  await this.setState({
                    isShowAddModal: true
                  })
                }}
                disabled={this.state.isAddBtnDefault === false}
              />}
          >
            <TabPane tab="动态参数" key="many">
              <Table 
                columns={this.columns} 
                dataSource={this.state.dataSource_table}
                expandedRowKeys={this.state.expandedRowKeys}
                childrenColumnName="children"
                onExpand={this.controlExpanding}
                onExpandedRowsChange={async (expandedRows) => {
                  console.log(expandedRows)
                }}
                expandable={{
                  // 额外的展开行
                  expandedRowRender: (record) => {
                    var temp = record.attr_vals.split(" ")
                    return (
                      this.renderTag(temp)
                    )
                  },
                  // 设置是否允许行展开
                  rowExpandable: () => {
                    return true
                  },
                }}
              />
            </TabPane>

            <TabPane tab="静态属性" key="only">
              <Table 
                columns={this.columns} 
                dataSource={this.state.dataSource_table}
                childrenColumnName="children"
                expandedRowKeys={this.state.expandedRowKeys}
                onExpand={this.controlExpanding}
                onExpandedRowsChange={async (expandedRows) => {
                  console.log(expandedRows)
                }}
                expandable={{
                  // 额外的展开行
                  expandedRowRender: (record) => {
                    var temp = record.attr_vals.split(" ")
                    return (
                      this.renderTag(temp)
                    )
                  },
                  // 设置是否允许行展开
                  rowExpandable: () => {
                    return true
                  },
                }}
              />
            </TabPane>
          </Tabs>

          <Modal
            title="Edit"
            destroyOnClose={true}
            visible={this.state.isShowEditModal === true}
            onOk={this.editOnOk}
            onCancel={async () => {
              await this.setState({
                isShowEditModal: false,
              })
            }}
          >
            {
              this.state.tabKey === "many" ? 
              <EditDyn
                setDynamicParamName={(input) => {this.DynamicParamName = input}}
                initDyn={this.state.selectedData === null ? "null" : this.state.selectedData.attr_name}
              /> :
              <EditSta
                setStaticParamName={(input) => {this.StaticParamName = input}}
                initSta={this.state.selectedData === null ? "null" : this.state.selectedData.attr_name}
              />
            }
          </Modal>

          <Modal
            title="delete"
            destroyOnClose={true}
            visible={this.state.isShowDeleteModal === true}
            onOk={this.deleteOnOk}
            onCancel={async() => {
              await this.setState({
                isShowDeleteModal: false
              })
            }}          
          >
            Sure to delete this param?
          </Modal>

          <Modal
            title="add"
            destroyOnClose={true}
            visible={this.state.isShowAddModal === true}
            onOk={async () => {
              var res = await ParamAPI.addParam({
                id: this.state.dataSource_table[0].cat_id,
                attr_name: this.addParamName.state.value,
                attr_sel: this.state.tabKey
              })
              var temp = [deepClone(res.data)]
              setKey(temp)
              console.log(this.state.dataSource_table)
              await this.setState({
                isShowAddModal: false,
                dataSource_table: [...this.state.dataSource_table, ...temp]
              })
            }}
            onCancel={async () => {
              await this.setState({
                isShowAddModal: false
              })
            }}
          >
            <Add
              addDynamicParamName={input => {this.addParamName = input}}
            />
          </Modal>
        </Card> 
      </>
    )
  }
}
