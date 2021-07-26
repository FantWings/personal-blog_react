import { message, notification } from 'antd'

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

    return response.ok ? HandleFetchSuccess(await response.json()) : HandleFetchFailed(response)
  } catch (error) {
    notification['error']({
      message: '接口请求出现错误',
      description: `请求路径：${url}， 错误原因：${error}`,
      key: 'socketError',
    })
  }
}

// 请求成功处理
const HandleFetchSuccess = ({ code, data, msg }: { code: number; data: any; msg: string }) => {
  switch (code) {
    case 0:
      msg && message.success(msg)
      return data
    case 1:
      message.error(msg)
      break
    case 10:
      localStorage.removeItem('sessionToken')
      message.warn({ content: '登录态过期，请重新登录', key: 'RequiredLogin' })
      break
    default:
      message.warn(msg)
      break
  }
}

// 请求失败处理
const HandleFetchFailed = ({ status }: { status: number }) => {
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
}
