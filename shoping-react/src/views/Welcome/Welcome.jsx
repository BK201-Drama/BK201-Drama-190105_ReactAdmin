import React, { Component } from 'react'
import './Welcome.css'
import Img from '../../assets/img/welcome.svg'

export default class Welcome extends Component {
  render() {
    return (
      <div>
        <div className={"image-box"}>
          <img src={Img} className={"image-welcome"}/>
        </div>
        <div className={"welcome"}>
          Welcome to this system!
        </div>
      </div>
    )
  }
}