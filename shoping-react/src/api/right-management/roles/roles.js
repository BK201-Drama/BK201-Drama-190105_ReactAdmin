import axios from '../../config'

export async function getRole () {
  var {data: res} = await axios.get('roles')
  return res
}

// 删除规则
export async function deleteRule (roleId, rightId) {
  var {data: resp} = await axios.delete(`roles/${roleId}/rights/${rightId}`)
  return resp
}
// 添加规则
export async function addRule (info) {
  var {data: resp} = await axios.post(`roles/${info.id}/rights`, info)
  return resp
}

export async function editRole (info) {
  var {data: resp} = await axios.put(`roles/${info.id}`, info)
  return resp
}

export async function deleteRole (roleId) {
  var {data: resp} = await axios.delete(`roles/${roleId}`)
  return resp
}

export async function addRole (info) {
  var {data: resp} = await axios.post('roles', info)
  return resp
}

