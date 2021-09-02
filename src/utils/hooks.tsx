import { useEffect, useState } from 'react'
import { userInfoRespond } from './interfaces'

export const useUserInfo = () => {
  // 初始化初始状态
  const [data, setData] = useState<userInfoRespond>()

  useEffect(() => {
    // 从localstorge序列化用户信息，返回给调用者
    const loggedInUser = localStorage.getItem('userInfo')
    if (loggedInUser) setData(JSON.parse(loggedInUser))
  }, [])

  return [data]
}
