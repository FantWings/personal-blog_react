import { useEffect, useState } from 'react'
import { userInfoRespond } from './interfaces'

export const useUserInfo = () => {
  const [data, setData] = useState<userInfoRespond>()

  useEffect(() => {
    const loggedInUser = localStorage.getItem('userInfo')
    console.log('Using LocalStorge UserInfo Data:', loggedInUser)
    if (loggedInUser) setData(JSON.parse(loggedInUser))
  }, [])

  return [data]
}
