/**
 * 注意，在这里的列表一定要有手风琴效果，也就是只能对一个数据进行展开，否则就会出现数据污染的问题
 */
import React, { Component } from 'react'
import { CheckCircleTwoTone, EditOutlined, DeleteOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { Table, Space, Tag, Card, Modal, Button, Descriptions, Row, Col } from 'antd'
import LinkButton from '../../../Components/LinkButton/LinkButton'
import Edit from './Form/Edit'
import Add from './Form/Add'

import * as RoleAPI from '../../../api/right-management/roles/roles'

const { Item } = Descriptions

// 设置key
const setKey = (categoriesList) => {
  for(let item in categoriesList){
    categoriesList[item] = {
      ...categoriesList[item],
      key: categoriesList[item].id
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

// 颜色哈希表
const setColor = new Map([
  [1, "blue"],
  [2, "green"],
  [3, "red"]
])

export default class Roles extends Component {
  state = {
    dataSource: [],
    isShowEditModal: false,
    isShowDeleteModal: false,
    isShowAddModal: false,
    isShowAllocateModal: false,

    selectedData: null,
    
    // 在这里，默认无展开为[]，有展开为[key]
    expandedRowKeys: []
  }

  // 递归渲染权限标签
  renderTableTag = (record, color) => {
    if(record.children !== undefined && record.children !== [] && record.children !== null){
      return (
        <Col>
          {
            record.children.map(item => {
              if (item.children) {
                return (
                  <Row style={{marginLeft: 150}}>
                    <Row>
                      <Tag
                        closable
                        onClose={async (e) => {

                          e.preventDefault()
                          var deleteData = await RoleAPI.deleteRule(this.state.selectedData.id, item.id)
                          console.log(deleteData.data)

                          var data = await RoleAPI.getRole()
                          var temp = deepClone(data.data)
                          setKey(temp)

                          this.setState({
                            dataSource: temp
                          })
                        }}
                        color={setColor.get(color)}
                      >
                        {item.authName}
                      </Tag>
                    </Row>
                    <Row>
                      {this.renderTableTag(item, color + 1)}
                    </Row>
                  </Row>
                )
              } else {
                return (
                  <Col style={{marginLeft: 150}}>
                    <Tag
                      closable
                      onClose={async () => {
                        var deleteData = await RoleAPI.deleteRule(this.state.selectedData.id, item.id)

                        var data = await RoleAPI.getRole()
                        var temp = deepClone(data.data)
                        setKey(temp)

                        this.setState({
                          dataSource: temp
                        })
                        console.log(temp)
                      }}
                      color={setColor.get(3)}
                    >
                      {item.authName}
                    </Tag>
                  </Col>
                )
              }
            })
          }
        </Col>
      )
    }
  }

  // 控制表的展开为手风琴式展开
  controlExpanding = (expanded, record) => {
    let temp = []
    if(expanded){
      temp.push(record.key)
    }
    this.setState({
      expandedRowKeys: temp,
      selectedData: record
    })
  }

  // 对话框中编辑名字和详细
  editNameAndDesc = async () => {
    var res = await RoleAPI.editRole({
      id: this.state.selectedData.id,
      roleName: this.RoleName.state.value,
      roleDesc: this.Description.state.value
    })

    // 我们可以根据函数来更改setState，就无需【深拷贝】-> 【大规模赋值】
    await this.setState({
      isShowEditModal: false,
      dataSource: this.state.dataSource.map(item => {
        if(item.id === res.data.roleId){
          item = {...item, roleName: res.data.roleName, roleDesc: res.data.roleDesc}
        }
        return item
      })
    })

  }

  // ------------------------------------------------------------------------------ //

  componentWillMount () {
    this.columns = [
      {
        title: 'role name',
        dataIndex: 'roleName',
        key: 'roleName',
        align: 'center'
      },{
        title: 'details',
        dataIndex: 'roleDesc',
        key: 'roleDesc',
        align: 'center'
      },{
        title: 'action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, record) => {
          return (
            <Space>
              <LinkButton 
                icon={<EditOutlined/>}
                type="primary"
                onClick={async() => {
                  await this.setState({
                    isShowEditModal: true,
                    selectedData: record
                  })
                }}
              />
              <LinkButton 
                icon={<DeleteOutlined/>}
                type="danger"
                onClick={async() => {
                  await this.setState({
                    isShowDeleteModal: true,
                    selectedData: record
                  })
                }}
              />
              <LinkButton 
                icon={<SettingOutlined/>}
                onClick={async() => {
                  await this.setState({
                    isShowAllocateModal: true,
                    selectedData: record
                  })
                }}
              />
            </Space>
          )
        }
      }
    ]
  }

  async componentDidMount () {
    var res = await RoleAPI.getRole()
    var tmp = deepClone(res.data)

    setKey(tmp)

    await this.setState({
      dataSource: tmp
    })
  }

  render() {
    return (
      <Card
        extra={<Button 
          icon={<PlusOutlined/>} 
          onClick={async () => {
            await this.setState({
              isShowAddModal: true
            }) 
          }}
        />}
      >
        <Table
          columns={this.columns} 
          dataSource={this.state.dataSource}
          childrenColumnName="child"
          expandedRowKeys={this.state.expandedRowKeys}
          onExpand={this.controlExpanding}
          onExpandedRowsChange={async (expandedRows) => {
            console.log(expandedRows)
          }}
          expandable={{
            // 额外的展开行
            expandedRowRender: (record) => this.renderTableTag(record, 1),
            // 设置是否允许行展开
            rowExpandable: () => {
              return true
            },
          }}
        />

        <Modal 
          title="Edit"
          destroyOnClose={true}
          visible={this.state.isShowEditModal === true}
          onOk={this.editNameAndDesc}
          onCancel={async () => {
            await this.setState({
              isShowEditModal: false,
            })
          }}
        >
          <Edit
            setRoleName={(input) => { this.RoleName = input }}
            setDescription={(input) => { this.Description = input }}
            roleName={this.state.selectedData === null ? "null" : this.state.selectedData.roleName}
            description={this.state.selectedData === null ? "null" : this.state.selectedData.roleDesc}
          />
        </Modal>

        <Modal
          title="delete"
          destroyOnClose={true}
          visible={this.state.isShowDeleteModal === true}
          onOk={async() => {
            var res = await RoleAPI.deleteRole(this.state.selectedData.id)
            console.log(res)
            // 对于删除操作，我们使用filter就可以了，不需要操作deepClone
            await this.setState({
              isShowDeleteModal: false,
              dataSource: this.state.dataSource.filter((item) => {
                return item.id !== this.state.selectedData.id
              })
            })
          }}
          onCancel={async() => {
            await this.setState({
              isShowDeleteModal: false
            })
          }}
        >
          Sure to delete this role?
        </Modal>

        <Modal
          title="allocate rule"
          destroyOnClose={true}
          visible={this.state.isShowAllocateModal === true}
          onOk={async() => {
            await this.setState({
              isShowAllocateModal: false,
            })
          }}
          onCancel={async() => {
            await this.setState({
              isShowAllocateModal: false
            })
          }}
        >

        </Modal>

        <Modal
          title="add role"
          destroyOnClose={true}
          visible={this.state.isShowAddModal === true}
          onOk={async () => {
            var res = await RoleAPI.addRole({
              roleName: this.addRoleName.state.value,
              roleDesc: this.addDescription.state.value
            })
            console.log(res)

            if(res.meta.status >= 200 && res.meta.status < 300){
              await this.setState({
                isShowAddModal: false,
                dataSource: [...this.state.dataSource, res.data]
              })
            }
          }}
          onCancel={async () => {
            await this.setState({
              isShowAddModal: false
            })
          }}
        >
          <Add 
            addRoleName={(input) => {this.addRoleName = input}}
            addDescription={(input) => {this.addDescription = input}}
          />
        </Modal>
      </Card>
    )
  }
}