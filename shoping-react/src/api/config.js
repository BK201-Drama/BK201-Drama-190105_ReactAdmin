import axios from 'axios'

// 添加进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 设置前部分url，后续的url都会与它拼接
axios.defaults.baseURL = 'http://120.77.57.222:8889/api/private/v1/'

// 是否为登录状态，不是就来登录获得token
// 请求拦截
axios.interceptors.request.use(config => {
  NProgress.start()
  var token = sessionStorage.getItem("token")
  // 如果有之前token，那么这个token需要放在请求头，传到后台，等后台验证发一个新的请求头过来
  if(token){
    config.headers.Authorization = token
  }
  return config
})
// 响应拦截
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

export default axios