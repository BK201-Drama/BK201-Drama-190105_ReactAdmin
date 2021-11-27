import React, { Component } from 'react'
import { Table, Space, Switch, notification, Card, Modal, Button } from 'antd'
import { withRouter } from 'react-router'
import { EditOutlined, DeleteOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons'

import * as UserManageAPI from '../../../api/user-management/list'
import * as RightAPI from '../../../api/right-management/roles/roles'

import LinkButton from '../../../Components/LinkButton/LinkButton'
import UpdateForm from './Form/UpdateForm'
import AddForm from './Form/AddForm'
import SelectRole from '../users/Select/SelectRole'

import { Select } from 'antd'

const { Option } = Select

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

class Users extends Component {

  state = {
    dataSource: [{
      "id": 500,
      "role_name": "超级管理员",
      "username": "admin",
      "create_time": 1486720211,
      "mobile": "000002",
      "email": "111112@qq.com",
      "mg_state": true
    }],

    whoIsUpdate: null,
    isShowUpdateModal: false,

    whoIsDelete: null,
    isShowDeleteModal: false,

    whoIsAllocated: null,
    isShowAllocatedModal: false,

    whoIsAdded: null,
    isShowAddModal: false,
    
    role: [],
    whoIsAllocated_rid: null,
    isRoleChange: false,
    // 选择的分配角色的对应对象
    selectedData: null
  }

  // ============================================ //

  // 更新数据
  updateMsg = async () => {
    // 用于更新后端数据
    await UserManageAPI.changeInfo({
      id: this.state.whoIsUpdate,
      email: this.email.state.value,
      mobile: this.mobile.state.value
    })

    // 用于更新前端数据，获取更新后的
    var res = await UserManageAPI.getUsers({
      pagenum: 1,
      pagesize: 10
    })
    
    await this.setState({
      dataSource: [...res.data.users],
      isShowUpdateModal: false
    })
  }

  // 删除数据
  deleteMsg = async () => {
    // 用于更新后端数据
    await UserManageAPI.deleteInfo(this.state.whoIsDelete)

    // 用于更新前端数据，获取更新后的
    var res = await UserManageAPI.getUsers({
      pagenum: 1,
      pagesize: 10
    })
    
    await this.setState({
      dataSource: [...res.data.users],
      isShowDeleteModal: false
    })
  }

  // 重新分配角色
  AllocatedMsg = async () => {
    await this.setState({
      isShowAllocatedModal: false
    })

    // 如果没有经过修改还是点击了【确定】，那么就直接返回
    if(!this.state.isRoleChange){
      return
    }

    // 将修改结果返回后端
    var res = await UserManageAPI.allocateRole(this.state.whoIsAllocated, {rid: this.state.whoIsAllocated_rid})

    console.log(res)
    if(res.meta.status !== 200){
      notification['error']({
        message: 'Error!',
        description: 'Fail to allocated role!',
        duration: 1
      })
      return
    }
    // 更改前端数据，不要频繁传后端，给后端增加压力
    await this.setState({
      dataSource: this.state.dataSource.map(item => {
        if(item.id === res.data.id){
          return {...item, role_name: this.state.selectedData}
        }
        return item
      })
    })
    notification['success']({
      message: 'Success!',
      description: 'success to allocated role!',
      duration: 1
    })
  }
  // 分配角色用的函数，用于获取选择栏的数据 
  getRole = async (SelectedData) => {
    // 将组件的数据给父亲
    await this.setState({
      selectedData: SelectedData
    })
    // 根据文本数据找到对应的rid
    for(let item of this.state.role){
      if(item.roleName === this.state.selectedData){
        this.setState({
          whoIsAllocated_rid: item.id,
          isRoleChange: true
        })
      }
    }
  }

  // 添加角色
  addMsg = async () => {
    await this.setState({
      isShowAddModal: false
    })
    let obj = await UserManageAPI.addInfo({
      // 这里一定要注意，这是双向绑定
      username: this.Username.state.value,
      password: this.PassWord.state.value,
      email: this.Email_add.state.value,
      mobile: this.Mobile_add.state.value
    })
    obj.data = {...obj.data, mg_state: true, create_time: Date.now(), role_name: "超级管理员"}

    await this.setState({
      dataSource: [...this.state.dataSource, obj.data]
    })
  }


  // ============================================ //

  async componentWillMount () {
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'username',
        key: 'username',
        align: 'center'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        align: 'center'
      },
      {
        title: '电话',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center'
      },
      {
        title: '角色',
        dataIndex: 'role_name',
        key: 'role_name',
        align: 'center'
      },
      {
        title: '状态',
        dataIndex: 'mg_state',
        key: 'mg_state',
        align: 'center',
    
        render: (text, record) => <Switch 
          checkedChildren="开启" unCheckedChildren="关闭"
    
          defaultChecked={record.mg_state}
    
          onChange={async (checked) => {
    
            var res = await UserManageAPI.changeState({
              id: record.id,
              mg_state: checked
            })
    
            // 添加改变状态成功的提示栏
            // 失败了也添加改变状态失败的提示栏
            if(res.meta.status === 200){
              record.mg_state = checked

              notification['success']({
                message: 'Success to change status!',
                duration: 0.5
              })
            } else {
              notification['error']({
                message: 'Error to change status!',
                duration: 0.5
              })
            }
          }}
        />
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        // record表示的是当前操纵的数据
        render: (text, record) => (
          <Space size="middle">
            <LinkButton
              onClick={async () => {
                await this.setState({
                  isShowUpdateModal: true,
                  whoIsUpdate: record.id,
                  selectedData: record,
                })
              }}
              icon={<EditOutlined />}
              type={"primary"}
            />

            <LinkButton
              onClick={async () => {
                await this.setState({
                  isShowDeleteModal: true,
                  whoIsDelete: record.id
                })
              }}
              icon={<DeleteOutlined/>}
              type={"danger"}
            />

            <LinkButton
              onClick={async () => {
                var myRole = await RightAPI.getRole()
                await this.setState({
                  role: myRole.data,
                  selectedData: record,
                  isShowAllocatedModal: true,
                  whoIsAllocated: record.id
                })
              }}
              icon={<SettingOutlined/>}
              type={"warn"}
            />
          </Space>
        ),
        align: 'center'
      }
    ]

    // 赋值权限
    var res = await RightAPI.getRole()

    await this.setState({
      role: res.data
    })
  }

  async componentDidMount () {
    var res = await UserManageAPI.getUsers({
      pagenum: 1,
      pagesize: 100
    })
    
    await this.setState({
      dataSource: [...res.data.users]
    })
  }

  // 我们需要明白一个道理：
  // 1. 表单提交，更新后端
  // 2. 对话框提交，更新前端
  // 所以表单最好组件独立出来，对话框与表格做兄弟组件方便通信
  render () {
    // const title = <p>搜索</p>
    return (
      <Card 
        // title={title} 
        extra={<Button 
          icon={<PlusOutlined/>} 
          onClick={() => {
            this.setState({
              isShowAddModal: true
            })
          }}
        />}
      >
        <Table columns={this.columns} dataSource={this.state.dataSource} onRow={(record) => {return record.id}} RowKey={(record) => {return record.id}}/>
        
        <Modal
          title="Update data"
          visible={this.state.isShowUpdateModal === true}
          onOk={this.updateMsg}
          onCancel={() => {
            this.setState({
              isShowUpdateModal: false
            })
          }}
          destroyOnClose={true}
        >
          <UpdateForm 
            setEmail={(email) => {
              this.email = email
            }}
            setMobile={(mobile) => {
              this.mobile = mobile
            }}
            Email={this.state.selectedData === null ? "NeedInit" : this.state.selectedData.email}
            Mobile={this.state.selectedData === null ? "NeedInit " : this.state.selectedData.mobile}
          />
        </Modal>

        <Modal
          title="Delete data"
          visible={this.state.isShowDeleteModal === true}
          onOk={this.deleteMsg}
          onCancel={() => {
            this.setState({
              isShowDeleteModal: false
            })
          }}
          destroyOnClose={true}
        >
          Are you want to delete this data?
        </Modal>

        <Modal
          title="Allocate role"
          visible={this.state.isShowAllocatedModal === true}
          onOk={this.AllocatedMsg}
          onCancel={() => {
            this.setState({
              isShowAllocatedModal: false,
              isRoleChange: false
            })
          }}
          destroyOnClose={true}
        >
          <SelectRole
            arr={this.state.role}
            getRole={this.getRole}
            defaultValue={this.state.selectedData === null ? "超级管理员": `${this.state.selectedData.role_name}`}
          />
        </Modal>

        <Modal
          title="Add data"
          visible={this.state.isShowAddModal === true}
          onOk={this.addMsg}
          onCancel={() => {
            this.setState({
              isShowAddModal: false
            })
          }}
          destroyOnClose={true}
        >
          <AddForm 
            setUsername={(Username) => {
              this.Username = Username
            }}
            setPassWord={(PassWord) => {
              this.PassWord = PassWord
            }}
            setEmail={(Email_add) => {
              this.Email_add = Email_add
            }}
            setMobile={(Mobile_add) => {
              this.Mobile_add = Mobile_add
            }}
          />
        </Modal>
      </Card>
    )
  }

}

export default withRouter(Users)
