import axios from '../config'

export async function getRoleList(){
  var {data: resp} = await axios.get(`roles`)
  return resp
}