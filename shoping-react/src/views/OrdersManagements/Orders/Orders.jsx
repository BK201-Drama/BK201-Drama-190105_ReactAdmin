import React, { Component } from 'react'
  import { Table, Space, Tag, Card, Modal, Button } from 'antd'
import { withRouter } from 'react-router'
import { EditOutlined, EnvironmentOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons'

import * as OrdersAPI from '../../../api/orders-management/orders'

import LinkButton from '../../../Components/LinkButton/LinkButton'
import UpdateForm from './Form/UpdateForm'

export default class Orders extends Component {
  state = {
    columns: [],
    dataSource: [],

    selectedData: null,

    whoIsUpdate: null,
    isShowUpdateModal: false,

    whoIsDelete: null,
    isShowDeleteModal: false,
  }

  EditOrder = async () => {
    var res = await OrdersAPI.EditOrder(this.state.whoIsUpdate, {
      id: this.state.whoIsUpdate,
      is_send: this.state.selectedData.is_send,
      order_pay: this.state.selectedData.order_pay,
      order_price: this.state.selectedData.order_price,
      order_number: this.state.selectedData.order_number,
      pay_status: this.state.selectedData.pay_status
    })
    console.log(res)
    console.log(this.citydata)
 
    this.setState({
      isShowUpdateModal: false
    })
  }

  async componentWillMount () {
    this.columns = [
      {
        title: '订单编号',
        dataIndex: 'order_number',
        key: 'order_number',
        align: 'center'
      },{
        title: '订单价格',
        dataIndex: 'order_price',
        key: 'order_price',
        align: 'center'
      },{
        title: '是否付款',
        dataIndex: 'order_pay',
        key: 'order_pay',
        align: 'center',
        render: (text, record) => {
          return (
            <Space size="middle">
              <Tag>未支付</Tag>
            </Space>
          )
        }
      },{
        title: '是否发货',
        dataIndex: 'is_send',
        key: 'is_send',
        align: 'center'
      },{
        title: '下单时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center'
      },{
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        render: (text, record) => (
          <Space size="middle">
            <LinkButton
              onClick={async () => {
                await this.setState({
                  isShowUpdateModal: true,
                  whoIsUpdate: record.order_id,
                  selectedData: record,
                })
                console.log(record)
              }}
              icon={<EditOutlined />}
              type={"primary"}
            />

            <LinkButton
              onClick={async () => {
                await this.setState({
                  isShowDeleteModal: true,
                  whoIsDelete: record.order_id,
                  selectedData: record
                })
                console.log(record)
              }}
              icon={<EnvironmentOutlined />}
              type={"danger"}
            />
          </Space>
        )
      }
    ]
  }

  async componentDidMount () {
    var resp = await OrdersAPI.getOrderList({
      pagenum: 1,
      pagesize: 5
    })
    await this.setState({
      dataSource: [...resp.data.goods]
    })
  }

  render() {
    return (
      <>
        <Card>
          <Table columns={this.columns} dataSource={this.state.dataSource}/>

          <Modal
            title="Edit order"
            visible={this.state.isShowUpdateModal === true}
            onCancel={() => {
              this.setState({
                isShowUpdateModal: false
              })
            }}
            onOk={this.EditOrder}
            destroyOnClose={true}
          >
            <UpdateForm
              setCityData = {(data) => { this.citydata = data }}
              setDetailedAddress = {(input) => { this.DetailedAddress = input }}
            />
          </Modal>


          <Modal
          title="logistics"
          visible={this.state.isShowDeleteModal === true}
          onOk={() => {
            this.setState({
              isShowDeleteModal: false
            })
          }}
          onCancel={() => {
            this.setState({
              isShowDeleteModal: false
            })
          }}
          destroyOnClose={true}
        >
          No body
        </Modal>
        </Card>
      </>
    )
  }
}
