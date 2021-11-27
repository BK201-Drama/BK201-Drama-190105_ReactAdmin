import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { Layout, Menu, } from 'antd'
import  { Scrollbars } from 'react-custom-scrollbars'
import {
  DesktopOutlined,
  FileOutlined,
  UserOutlined
} from '@ant-design/icons'

import style from './LeftBar.module.css'
import * as menuAPI from '../../api/get-menu/menu'

import axios from 'axios'

const { Sider } = Layout
const { SubMenu } = Menu

const menuList = [
  // {
  //   key: '/1',
  //   title: '用户管理',
  //   icon: <DesktopOutlined />,
  //   Children: [{
  //     key: 'users',
  //     title: '用户列表'
  //   }]
  // },{
  //   key: '/2',
  //   title: '权限管理',
  //   icon: <DesktopOutlined />,
  //   Children: [{
  //     key: 'roles',
  //     title: '角色列表'
  //   },{
  //     key: 'rights',
  //     title: '权限列表'
  //   }]
  // },{
  //   key: '/3',
  //   title: '商品管理',
  //   icon: <DesktopOutlined />,
  //   Children: [{
  //     key: 'goods',
  //     title: '商品列表'
  //   },{
  //     key: 'params',
  //     title: '分类参数'
  //   },{
  //     key: 'categories',
  //     title: '商品分类'
  //   }]
  // },{
  //   key: '/4',
  //   title: '订单管理',
  //   icon: <DesktopOutlined />,
  //   Children: [{
  //     key: 'orders',
  //     title: '订单列表'
  //   }]
  // },{
  //   key: '/5',
  //   title: '数据统计',
  //   icon: <DesktopOutlined />,
  //   Children: [{
  //     key: 'reports',
  //     title: '数据报表'
  //   }]
  // }
]


function LeftBar(props) {

  // state and set state
  const [menu, setMenu] = useState(menuList)

  // hook 
  useEffect(async () => {
    const result = await axios.get('menus')

    // 改变menu的方法，而不是用赋值号
    // result是res请求体，res.data才是我们需要的发送数据，res.data,data才是后端渲染
    setMenu(Array.from(result.data.data))

  }, [])

  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if(item.children?.length > 0){
        return <SubMenu key={item.id} title={item.authName}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      return <Menu.Item key={item.path} onClick={() => {
        props.history.push('/' + item.path)
      }}>{item.authName}</Menu.Item>
    })
  }

  const selectedKeys = [props.location.pathname]
  const openKeys = ['/'+props.location.pathname.split('/')[1]]

  return (
    <Sider theme="light">
      <div style={{display: 'flex', height: "100%", "flexDirection": "column"}}>
        {/* module.css的功能 */}
        <div className={style.logo} onClick={() => {
          props.history.push('/welcome')
        }}>后台管理系统</div>
        <Scrollbars>
          <div style={{flex: 1, "overflow": "auto"}}>
            <Menu theme="light" selectedKeys={selectedKeys} mode="inline" defaultOpenKeys={openKeys}>
              {renderMenu(menu)}
            </Menu>
          </div>
        </Scrollbars>
      </div>
    </Sider>
  )
}

export default withRouter(LeftBar)