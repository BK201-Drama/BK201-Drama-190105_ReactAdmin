import axios from '../../config'

export async function rights () {
  var {data: resp} = await axios.get('/menus')
  
  return resp
}