import { message, notification } from 'antd'

/**
 * Fetch封装 -
 * API需要返回以下JSON格式：
 * { code=状态码, msg=消息, data=数据体 }
 * @param {string} url 请求地址
 * @param {object} config fetch高级配置
 * @param {funcion} setLoading Hooks设置加载状态的回调
 * @return {object} data 数据体
 */

export async function fetchData(url: string, method?: 'GET' | 'POST' | 'DELETE', headers?: object, body?: object) {
  try {
    const response = await fetch(url, {
      method: method || 'GET',
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body) || undefined,
    })

    const { ok, status } = response
    if (!ok) {
      switch (status) {
        case 400:
          message.error('请求包含语法错误或无法完成请求！')
          break
        case 404:
          message.error('请求的资源未找到！')
          break
        case 500:
          message.error('服务器在处理请求的过程中发生了错误')
          break
        default:
          message.error('未知错误，请求失败')
      }
    } else {
      const { code, data, msg }: { code: number; data: any; msg: string } = await response.json()
      switch (code) {
        case 0:
          if (msg) message.success(msg)
          return data
        case 1:
          message.error(msg)
          return undefined
        case 10:
          localStorage.removeItem('sessionToken')
          message.warn({ content: '登录态过期，请重新登录', key: 'RequiredLogin' })
          return undefined
        default:
          message.warn(msg)
          return undefined
      }
    }
  } catch (error) {
    notification['error']({
      message: '接口请求出现错误',
      description: `请求路径：${url}， 错误原因：${error}`,
      key: 'socketError',
    })
    return false
  }
}
