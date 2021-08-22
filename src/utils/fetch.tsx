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
        const { ok, status } = response
        if (!ok) {
          switch (status) {
            case 400:
              return Promise.reject('请求包含语法错误或无法完成请求！')
            case 404:
              return Promise.reject('请求的资源未找到！')
            case 500:
              return Promise.reject('服务器在处理请求的过程中发生了错误')
            default:
              return Promise.reject('未知错误，请求失败')
          }
        } else {
          return response.json()
        }
      },
      (reason) => {
        notification['error']({
          message: '服务器通讯失败',
          description: `路径：${url}， 原因：${reason}`,
          key: 'socketError',
        })
      }
    )
    .then(
      (jsonData) => {
        const { data, status, msg }: standerdResponse = jsonData
        switch (status) {
          case 1:
            message.error(msg)
            throw status
          case 2:
            message.warn(msg)
            throw status
          case 10:
            localStorage.clear()
            message.warn('登录状态失效，请刷新页面')
            throw status
          default:
            return data
        }
      },
      (reason) => {
        message.error(reason)
      }
    )
}

export default fetchData
