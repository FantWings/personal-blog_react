import React, { useEffect, useState } from 'react'
import fetchData from '../utils/fetch'
import { BASEURL } from '../config'
import { userDataInterface } from '../utils/interfaces'

const AuthContext = React.createContext({
  token: '',
  loggedIn: false,
  expTime: 0,
  userInfo: {
    avatar: '',
    email: {
      addr: '',
      verifyed: 0,
    },
    is_admin: 0,
    nickname: '',
    phone: undefined,
    qq: undefined,
    uuid: '',
  },
})

const AuthProvider = (props: any) => {
  const [token] = useState<string>(localStorage.getItem('token') || '')
  const [expTime] = useState<number>(Number(localStorage.getItem('expTime')) || 0)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<userDataInterface>({
    avatar: undefined,
    email: {
      addr: '',
      verifyed: 0,
    },
    is_admin: 0,
    nickname: '',
    phone: undefined,
    qq: undefined,
    uuid: '',
  })

  useEffect(() => {
    if (token !== '' && expTime > new Date().getTime()) {
      fetchData(`${BASEURL}/api/v1/user/userInfo`, 'GET', { token: token })
        .then((userInfoData: userDataInterface) => setUserInfo(userInfoData))
        .then(() => {
          setLoggedIn(true)
        })
    } else setLoggedIn(false)
  }, [token])

  return <AuthContext.Provider value={{ token, userInfo, loggedIn }} {...props} />
}

export { AuthContext, AuthProvider }
