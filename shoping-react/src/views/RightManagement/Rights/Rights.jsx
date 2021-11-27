import React, { Component, useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import * as rightsAPI from '../../../api/right-management/rights/rights'
import { Table, Tag, Space } from 'antd'

const columns = [
  {
    title: 'id号',
    dataIndex: 'id',
    key: 'id',
    align: 'center'
  },
  {
    title: '权限标题',
    dataIndex: 'authName',
    key: 'authName',
    render: (text, record) => (
      <a href={`#/${record.path}`}>{text}</a>
    ),
    align: 'center'
  },
  {
    title: '权限路径',
    dataIndex: 'path',
    key: 'path',
    align: 'center'
  },
  {
    title: '权限等级',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {
          tags.map(tag => {
            var arr = [...tag]

            let color = parseInt(arr[0]) > 1 ? 'green' : 'geekblue'
            // if (tag === 'loser') {
            //   color = 'volcano';
            // }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })
        }
      </>
    ),
    align: 'center'
  }
];

// 数据
const data = []


function Rights (props) {

  const [dat, setDat] = useState(data)

  const [column, setColumn] = useState(columns)

  // 深拷贝函数
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

  // 级别
  var rank = 1
  const setKeyAndTags = (data) => {
    // 为什么这里不使用of遍历呢？
    // 因为在这里，of将会和data的关系割裂开
    for(let item in data){
      data[item] = {...data[item], key: `${data[item].id}`, tags: [`${rank}级目录`]}
      if(data[item].children?.length > 0){
        rank++
        setKeyAndTags(data[item].children)
        rank--
      }
    }
  }

  useEffect(async () => {

    // 我是傻逼，只需要重新赋值一次，就可以将promise对象转换为object
    var rig = await rightsAPI.rights()

    var res = deepClone(rig.data)

    await setKeyAndTags(res)
    await setDat(res)
  }, [])

  return (
    <div>
      <Table columns={column} dataSource={dat} filterMode={'menu'}/>
    </div>
  )
}

export default withRouter(Rights)