import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from '../views/Login/Login'
import PageContainer from '../views/PageContainer/PageContainer'

export default function IndexRouter () {
  return (
    <HashRouter>
      <Switch>
        <Route path='/login' component={Login}/>
        {/* 妈的，不要在箭头函数乱加花括号 */}
        <Route path='/' render={() => 
          sessionStorage.getItem("token")?
          (<PageContainer/>): (<Redirect to="/login"/>)
        }/>
      </Switch>
    </HashRouter>
  )
}