import React, { Component } from 'react'
import { Table, Space, Switch, notification, Card, Modal, Button } from 'antd'
import { EditOutlined, DeleteOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons'

import UpdateForm from './Form/UpdateForm'

import LinkButton from '../../../Components/LinkButton/LinkButton'

import * as GoodAPI from '../../../api/item-management/goods/goods' 

export default class Goods extends Component {

  state = {
    dataSource: [
      {
          "goods_id": 926,
          "cat_id": null,
          "goods_name": "【海外购自营】黎珐(ReFa) MTG日本 CARAT铂金微电流瘦脸瘦身提拉紧致V脸美容仪 【保税仓发货】",
          "goods_price": 1399,
          "goods_number": 100,
          "goods_weight": 100,
          "goods_state": 0,
          "add_time": 1514345477,
          "upd_time": 1514345477,
          "hot_mumber": 0,
          "is_promote": false,
          "cat_one_id": null,
          "cat_two_id": null,
          "cat_three_id": null
      }
    ],

    // 选择的分配角色的对应对象
    selectedData: null,
    // 我们根据id，从数据库获取到的相应对象
    getDataById: null,

    isShowUpdateModal: false,
    isShowDeleteModal: false,
    isShowAddModal: false
  }

  // =================================================== //

  getMsg = async () => {
    await this.setState({
      isShowUpdateModal: false
    })

    console.log(this.state.selectedData)

    // 更新数据
    var res = await GoodAPI.updateGoods({
      id:  this.state.getDataById.goods_id,
      goods_name: this.GoodsName.state.value,
      goods_price: this.GoodsPrice.state.value,
      goods_number: this.state.getDataById.goods_number,
      goods_weight: this.GoodsWeight.state.value,
      goods_cat: this.state.getDataById.goods_cat
    })


    console.log(res)

    if(res.meta.status === 200){
      await this.setState({
        dataSource: this.state.dataSource.map(item => {
          if(item.goods_id === res.data.goods_id){
            return {
              ...item,       
              goods_name: res.data.goods_name,
              goods_price: res.data.goods_price,
              goods_number: res.data.goods_number,
              goods_weight: res.data.goods_weight
            }
          }
          return item
        })
      })
      notification['success']({
        message: 'Success!',
        description: 'success to update goods!',
        duration: 1
      })
    }else{
      notification['error']({
        message: 'Error!',
        description: 'cant find the updated goods!',
        duration: 1
      })
    }
  }

  deleteMsg = async () => {
    var res = await GoodAPI.deleteGoods(this.state.getDataById.goods_id)
    var res_getdata = await GoodAPI.getGoods({
      pagenum: 1,
      pagesize:10
    })
    console.log(res)
    if(res.meta.status === 200){
      await this.setState({
        isShowDeleteModal: false,
        dataSource: res_getdata.data.goods
      })

      notification['success']({
        message: 'Success!',
        description: 'success to delete goods!',
        duration: 1
      })
    }else{
      notification['error']({
        message: 'Error!',
        description: 'cant find the delete goods!',
        duration: 1
      })
    }
  }

  // 跳转到新的表单页面
  addMsg = async () => {
    this.props.history.push('/goods/addGood')
  }

  // =================================================== //


  async componentWillMount () {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'goods_name',
        key: 'goods_name',
        align: 'center'
      },{
        title: '商品价格',
        dataIndex: 'goods_price',
        key: 'goods_price',
        align: 'center'
      },{
        title: '商品重量',
        dataIndex: 'goods_weight',
        key: 'goods_weight',
        align: 'center'
      },{
        title: '创建时间',
        dataIndex: 'add_time',
        key: 'add_time',
        align: 'center'
      },{
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        align: 'center',
        render: (text, record) => (
          <Space size="middle">
            <LinkButton 
              icon={<EditOutlined />}
              type={"primary"}
              onClick={async () => {
                for(let item of this.state.dataSource){
                  if(item.goods_name === record.goods_name){
                    var res = await GoodAPI.findGoodsById(item.goods_id)
                  }
                }

                await this.setState({
                  isShowUpdateModal: true,
                  selectedData: record,
                  getDataById: res.data
                })
              }}
            />
            <LinkButton
              icon={<DeleteOutlined/>}
              type={"danger"}
              onClick={async () => {
                for(let item of this.state.dataSource){
                  if(item.goods_name === record.goods_name){
                    var res = await GoodAPI.findGoodsById(item.goods_id)
                  }
                }
                await this.setState({
                  isShowDeleteModal: true,
                  selectedData: record,
                  getDataById: res.data
                })
              }}
            />
          </Space>
        )
      }
    ]
  }

  async componentDidMount () {
    var resq = await GoodAPI.getGoods({
      pagenum: 1,
      pagesize: 10
    })
    resq = resq.data.goods
    console.log(resq)
    await this.setState({
      dataSource: resq
    })
  }

  render() {
    return (
      <Card
        extra={<Button 
          icon={<PlusOutlined/>} 
          onClick={() => {
            this.props.history.push('/goods/addGood')
          }}
        />}
      >
        <Table columns={this.columns} dataSource={this.state.dataSource}/>

        {/* 修改对话框 */}
        <Modal
          title="update data"
          visible={this.state.isShowUpdateModal === true}
          onOk={this.getMsg}
          onCancel={() => {
            this.setState({
              isShowUpdateModal: false
            })
          }}
          destroyOnClose={true}
        >
          <UpdateForm
            setGoodsName={(GoodsName) => { this.GoodsName = GoodsName }}
            setGoodsPrice={(GoodsPrice) => { this.GoodsPrice = GoodsPrice }}
            setGoodsWeight={(GoodsWeight) => { this.GoodsWeight = GoodsWeight }}
          />
        </Modal>

        {/* 删除对话框 */}
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

        {/* 修改角色对话框 */}
        <Modal
          title="Delete data"
          visible={this.state.isShowAddModal === true}
          onOk={this.deleteMsg}
          onCancel={() => {
            this.setState({
              isShowAddModal: false
            })
          }}
          destroyOnClose={true}
        >
          
        </Modal>
      </Card>
    )
  }
}
