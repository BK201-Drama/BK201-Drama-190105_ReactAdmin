import axios from '../../config'

// 获取数据
export async function getGoods (info) {
  var {data: resp} = await axios.get(`goods?pagenum=${info.pagenum}&pagesize=${info.pagesize}`, info)
  return resp
}

// 查找数据
export async function findGoodsById (id) {
  var {data: resp} = await axios.get(`goods/${id}`)
  return resp
}

// 更新
export async function updateGoods (info) {
  var {data: resp} = await axios.put(`goods/${info.id}`, info)
  return resp
}

// 删除
export async function deleteGoods (id) {
  var {data: resp} = await axios.delete(`goods/${id}`)
  return resp
}

// 商品分类的获取
export async function getCategories (info) {
  if (!info) {
    info = {type: 3}
  }
  var {data: resp} = await axios.get(`categories`, {params: info})
  return resp
}

// 添加商品
export async function addCategory (info) {
  var {data: resp} = await axios.post(`goods`, info)
  return resp
}