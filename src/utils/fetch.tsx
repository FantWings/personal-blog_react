import { message, notification } from 'antd'
import { standerdResponse } from './interfaces'

const fetchData = (url: string, method: 'GET' | 'POST' | 'PUT', headers?: object, body?: object) => {
  return fetch(url, {
    method: method || 'GET',
    headers: method === 'GET' ? { ...headers } : { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body) || undefined,
  })
    .then(
      (response) => {
        const { status } = response
        switch (status) {
          case 200:
            return Promise.resolve(response.json())
          case 400:
            return Promise.reject({ msg: '请求包含语法错误或无法完成请求！', status })
          case 404:
            return Promise.reject({ msg: '请求的资源未找到！', status })
          case 500:
            return Promise.reject({ msg: '服务器在处理请求的过程中发生了错误', status })
          case 405:
            return Promise.reject({ msg: '请求方式不被允许', status })
          default:
            return Promise.reject({ msg: '未知错误，请求失败', status })
        }
      },
      (response) => {
        notification['error']({
          message: '服务器通讯失败',
          description: `路径：${url}， 原因：${response}`,
          key: 'socketError',
        })
        return { status: 1, msg: '与服务器通讯失败' }
      }
    )
    .then(
      (jsonData: standerdResponse) => {
        const { data, status, msg } = jsonData
        switch (status) {
          case 0:
            return Promise.resolve(data)
          case 1:
            msg && message.error({ content: msg, key: 'errMsg' })
            return Promise.reject({ status, msg })
          case 2:
            msg && message.warn({ content: msg, key: 'warnMsg' })
            return Promise.reject({ status, msg })
          case 5:
            notification.error({ message: '后端错误', description: msg, closeIcon: true })
            return Promise.reject({ status, msg })
          case 10:
            localStorage.clear()
            message.warn({ content: '登录状态失效，请重新登录', key: 'loginRequiredMsg' })
            return Promise.reject({ status, msg })
        }
      },
      ({ msg, status }) => {
        message.error(`${status}  ${msg}`)
        return Promise.reject({ status, msg })
      }
    )
}

export default fetchData
