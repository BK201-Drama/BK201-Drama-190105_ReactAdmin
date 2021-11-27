import axios from '../config'

export async function login (loginInfomation) {
  var {data: resp} = await axios.post('/login', loginInfomation)
  if(resp.data){
    sessionStorage.setItem('token', resp.data.token)
  }
  return resp
}

export function logOut () {
  sessionStorage.removeItem('token')
}