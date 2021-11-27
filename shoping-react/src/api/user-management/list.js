import axios from '../config'

// 获取用户数组
export async function getUsers (info) {
  var {data: resp} = await axios.get(
    `/users?pagenum=${info.pagenum}&pagesize=${info.pagesize}`
  )
  return resp
}

// 更改状态
export async function changeState (info) {
  // 因为await会将response包装成一个promise对象，因此我们需要取出data: res
  var {data: resp} = await axios.put(`users/${info.id}/state/${info.mg_state}`)
  return resp
}

// 更改用户信息
export async function changeInfo (info) {
  var {data: resp} = await axios.put(`users/${info.id}`, info)
  return resp
}

// 删除该用户信息
export async function deleteInfo (id) {
  var {data: resp} = await axios.delete(`users/${id}`)
  return resp
}

// 分配该用户角色
export async function allocateRole (id, info) {
  var {data: resp} = await axios.put(`users/${id}/role`, info)
  return resp
}

export async function addInfo (info) {
  var {data: resp} = await axios.post(`users`, info)
  return resp
}