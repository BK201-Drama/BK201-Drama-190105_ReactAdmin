import axios from '../config'

export async function getOrderList (info) {
  var {data: resp} = await axios.get(`orders`, {params: info})
  return resp
}

export async function EditOrder (order_id, info) {
  var {data: resp} = await axios.put(`orders/${order_id}`, info)
  return resp
}