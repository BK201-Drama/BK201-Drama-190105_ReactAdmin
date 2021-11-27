import React, { useEffect, useState } from 'react'
import { Breadcrumb } from 'antd'

import {
  DesktopOutlined,
  FileOutlined,
  UserOutlined
} from '@ant-design/icons'

const menuList = [
  {
    key: '/1',
    title: '用户管理',
    icon: <DesktopOutlined />,
    Children: [{
      key: '/users',
      title: '用户列表'
    }]
  },{
    key: '/2',
    title: '权限管理',
    icon: <DesktopOutlined />,
    Children: [{
      key: '/roles',
      title: '角色列表'
    },{
      key: '/rights',
      title: '权限列表'
    }]
  },{
    key: '/3',
    title: '商品管理',
    icon: <DesktopOutlined />,
    Children: [{
      key: '/goods',
      title: '商品列表',
    },{
      key: '/params',
      title: '分类参数'
    },{
      key: '/categories',
      title: '商品分类'
    },{
      key: '/goods/addGood',
      title: '添加商品'
    }]
  },{
    key: '/4',
    title: '订单管理',
    icon: <DesktopOutlined />,
    Children: [{
      key: '/orders',
      title: '订单列表'
    }]
  },{
    key: '/5',
    title: '数据统计',
    icon: <DesktopOutlined />,
    Children: [{
      key: '/reports',
      title: '数据报表'
    }]
  }
]

export default function Breadcrumb_ (props) {

  const [menu, setMenu] = useState(menuList)

  const _url = window.location.hash
  var url = _url.match(/#(\S*)/)[1]
  // var k = _url.match(/[^#](\S*)[/](\S*)/)
  // console.log(k)

  useEffect(()=>{

  },[])

  // const url = _url.split(/^#/)

  const findUrl = (url, menuList) => {
    for(var v of menuList){
      if(v.Children?.length > 0) {
        for(var vc of v.Children){
          if(vc.key === url){
            return [v, vc]
          }
        }
      }
  
      if(v.key === url){
        return [v]
      }
    }
  }

  const renderBreadcrumb = (url, menuList) => {
    var findUrlArr = findUrl(url, menuList)
    return (
      url === '/' ? <></> : (
        url ==='/welcome' ?
        <Breadcrumb style={{ margin: '16px 0' }}>
         <Breadcrumb.Item>Welcome</Breadcrumb.Item>
        </Breadcrumb> :
        <Breadcrumb style={{ margin: '16px 0' }}>
         {
           findUrlArr.map(item => {
             return (<Breadcrumb.Item>{item.title}</Breadcrumb.Item>)
           })
         }
       </Breadcrumb>
      )
    )
  }

  return (
    <div>
      {renderBreadcrumb(url, menu)}
    </div>
  )
}