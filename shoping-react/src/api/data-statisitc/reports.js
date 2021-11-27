import axios from '../config'

export async function report () {
  var {data: resp} = await axios.get('/reports/type/1')

  
  return resp
}