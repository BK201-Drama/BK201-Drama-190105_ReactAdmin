import axios from '../../config'

// 获取参数列表
export async function getParamList(id, info){
  var {data: resp} = await axios.get(`categories/${id}/attributes`, {params: info})
  return resp
}

// 添加参数
export async function addParam(info){
  var {data: resp} = await axios.post(`categories/${info.id}/attributes`, info)
  return resp
}

// 删除参数
export async function deleteParam(id, attrId){
  var {data: resp} = await axios.delete(`categories/${id}/attributes/${attrId}`)
  return resp
}

// 查找参数
export async function findParam(info){
  var {data: resp} = await axios.get(`categories/${info.id}/attributes/${info.attrId}`, {params: info})
  return resp
}

// 修改（更新）参数
export async function updateParam(info){
  var {data: resp} = await axios.put(`categories/${info.id}/attributes/${info.attrId}`, info)
  return resp
}

export async function getCategoriesList(info){
  if(!info){
    var {data: resp} = await axios.get(`categories`)
    return resp
  }
  var {data: resp} = await axios.get(`categories?type=${info}`)
  return resp 
}