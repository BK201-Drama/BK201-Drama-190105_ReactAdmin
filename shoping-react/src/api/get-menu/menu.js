import axios from '../config'

export async function menu () {
  var {data: resp} = await axios.get('/menus')
  return resp.data
}