import axios from '../../config'

export async function getCategoriesList(info){
  if(!info){
    var {data: resp} = await axios.get(`categories`)
    return resp
  }
  var {data: resp} = await axios.get(`categories?type=${info}`)
  return resp
}

export async function findCategory(id){
  var {data: resp} = await axios.get(`categories/${id}`)
  return resp
}

export async function updateCategory(id, info){
  var {data: resp} = await axios.put(`categories/${id}`, info)
  return resp
}

export async function deleteCategory(id){
  var {data: resp} = await axios.delete(`categories/${id}`)
  return resp
}

export async function addCategory(info){
  var {data: resp} = await axios.post(`categories`, info)
  return resp
}