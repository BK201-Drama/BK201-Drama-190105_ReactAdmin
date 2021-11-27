// 用于集合所有的页面
import React from 'react'
import { Route, Switch } from 'react-router'
import { Redirect } from 'react-router-dom'

import { Layout, Breadcrumb } from 'antd'
import './PageContainer.css'

// ---------------引入左菜单和上区域的组件------------------ //
import LeftBar from '../../Components/LeftBar/LeftBar'
import TopBar from '../../Components/TopBar/TopBar'
import Crumbs from '../../Components/Crumbs/Crumbs'

import NoPermission from '../NoPermission/NoPermission'
import Welcome from '../Welcome/Welcome'

import Users from '../UserManagement/users/Users'

import Roles from '../RightManagement/Roles/Roles'
import Rights from '../RightManagement/Rights/Rights'

import Categories from '../ItemManagement/categories/Categories'
import Goods from '../ItemManagement/goods/Goods'
import AddGood from '../ItemManagement/goods/AddGood/AddGood'
import Params from '../ItemManagement/params/Params'

import Orders from '../OrdersManagements/Orders/Orders'

import Reports from '../DataStatistic/Reports/Reports'

const { Content } = Layout

export default function PageContainer () {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <LeftBar />
      <Layout className="site-layout">
        <TopBar></TopBar>
        <Content style={{ margin: '0 16px' }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          <Crumbs/>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360, }}>
            <Switch>
              <Route path="/welcome" component={Welcome} exact/>

              <Route path="/users" component={Users} exact/>

              <Route path="/roles" component={Roles} exact/>
              <Route path="/rights" component={Rights} exact/>

              <Route path="/categories" component={Categories} exact/>

              <Route path="/goods" component={Goods} exact/>
              <Route path="/goods/addGood" component={AddGood} exact/>
              
              <Route path="/params" component={Params} exact/>

              <Route path="/orders" component={Orders} exact/>

              <Route path="/reports" component={Reports} exact/>

              <Redirect from="/" to="/welcome" exact/>
              <Route path="*" component={NoPermission}/>
            </Switch>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}