
import axios from 'axios'
import { Toast } from 'vant'
import router from '../router'
import {i18n} from '@/assets/lang'

axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? '/' : (window.requestAPI)
// axios.defaults.withCredentials = true
// axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.headers['token'] = localStorage.getItem('token') || ''
axios.defaults.headers['Content-Type'] = 'text/plain' //'application/json'


//请求发送拦截，把数据发送给后台之前做些什么......
axios.interceptors.request.use((request) => {

  // //这个例子中data是loginName和password
  // let REQUEST_DATA = request.data
  // //统一进行qs模块转换
  // request.data = qs.stringify(REQUEST_DATA)
  const token = localStorage.getItem('token')
  const uid = localStorage.getItem('uid')
  if(token){
    request.url += `?token=${token}&uid=${uid}`
  }
  
  //再发送给后台
  return request;

}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


axios.interceptors.response.use(res => {
  
  if (typeof res.data !== 'object') {
    Toast.fail( i18n.global.t('服务端异常') )
    return Promise.reject(res)
  }
  if (res.data.code != 0) {
    if (res.data.msg) Toast.fail( i18n.global.t(res.data.msg) )
    if (res.data.code == 406) {
      localStorage.removeItem('token')
      router.push({ path: '/login' })
    }
    // if (res.data.data && window.location.hash == '#/login') {
    //   localStorage.setItem('token', res.data.data)
    //   axios.defaults.headers['token'] = res.data.data
    // }

    return Promise.reject(res.data)
  }

  return res.data
}, err => {
  Promise.reject(err)
})

export default axios
