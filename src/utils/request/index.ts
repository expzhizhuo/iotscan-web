/* 对axios的请求封装 */
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import axiosRetry from 'axios-retry'

const service = axios.create({
  baseURL: '/api',
  timeout: 10 * 60 * 1000
} as any)

/**
 * 请求重试配置
 */
axiosRetry(service, {
  retries: 3, // 设置重试次数为3次
  retryDelay: () => 1000, // 设置重试的间隔时间
  shouldResetTimeout: true, // 重置请求超时时间
  // error.code===ECONNABORTED表示请求超时了 ERR_NETWORK网络出错
  retryCondition: (error) => ['ECONNABORTED', 'ERR_NETWORK'].includes(error.code!) // 重试条件
})

/**
 * 每次请求在 header 中带上 token
 */
service.interceptors.request.use((config: any) => {
  const userStore = useUserStore()
  if (userStore.getToken()) {
    config.headers.Authorization = 'Bearer ' + userStore.getToken()
  }
  return config
})
/**
 * 拦截每一次响应，判断是否 token 失效
 * 如果 token 失效就退出登录并提示信息
 */
service.interceptors.response.use(
  (response) => {
    const res = response
    const userStore = useUserStore()
    // token 无效
    if (res.data.code === 401 || res.data.code === 402 || res.status === 401) {
      ElMessage({
        message: res.data.msg || '页面长时间未使用，请重新登录',
        type: 'warning',
        duration: 5000
      })
      userStore.logout()
      handleError('页面长时间未使用，请重新登录')
      return Promise.reject(new Error(res.data.msg || 'Error'))
    } else if (res.status != 200 || (res.data.code != 200 && 'code' in res.data)) {
      let data: string = ''
      if (res.data.data && res.data.data != '') {
        data = res.data.data
      } else if (res.data.msg && res.data.msg != 'error') {
        data = res.data.msg
      }
      ElMessage({
        message: data || '接口异常',
        type: 'error',
        duration: 5000
      })
      return Promise.reject(new Error(data || '接口异常'))
    } else {
      return res
    }
  },
  (error) => {
    /**
     * axios拦截器请求错误统一处理
     */
    if (error.response.status == 401 || error.response.data.code == 401) {
      ElMessage.error('非法访问')
      router.push('/401').then()
    } else if (error.response.status == 500) {
      ElMessage.error('服务器出错了')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
    } else if (error.response.status == 429) {
      ElMessage.error(error.response.data.msg)
    } else {
      handleError('服务器异常')
    }
  }
)

function handleError(msg: string) {
  /**
   * 统一错误处理
   */
  const userStore = useUserStore()
  const userName = userStore.getUserName()
  if (userName) {
    ElMessageBox.confirm(msg, {
      confirmButtonText: '再次登录',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logout()
    })
  }
}

export default service
