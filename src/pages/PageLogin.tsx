import { useState } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { Avatar } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { ThemeColor } from '../utils/constent'
import fetchData from '../utils/fetch'
import { BASEURL } from '../config'
import { userInfoRespond } from '../utils/interfaces'

export default function PageLogin() {
  const [type, setType] = useState(0)
  const [height, setHeight] = useState(351)
  return (
    <PageContainer>
      <LoginContainer style={{ height: `${height}px` }}>
        <TypeSwitcher>
          <span
            className={`switchButton ${type ? undefined : 'active'}`}
            onClick={() => {
              setType(0)
              setHeight(351)
            }}
          >
            登录
          </span>
          <span
            className={`switchButton ${type ? 'active' : undefined}`}
            onClick={() => {
              setType(1)
              setHeight(450)
            }}
          >
            注册
          </span>
        </TypeSwitcher>
        <>{type ? <RegisterFrom /> : <LoginForm />}</>
      </LoginContainer>
    </PageContainer>
  )
}

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const HandleLogin = (e: any) => {
    e.preventDefault()
    setLoading(true)
    fetchData(`${BASEURL}/api/v1/auth/login`, 'POST', undefined, {
      username,
      password,
    })
      .then(({ token }) => {
        // 登录成功，将token写入localStorge
        localStorage.setItem('token', token)
        // 登录成功，更新登录标
        localStorage.setItem('loggedIn', 'true')
        // 登录成功，获取用户信息
        return fetchData(`${BASEURL}/api/v1/user/userInfo`, 'GET', { token: token })
      })
      .then((userInfoData: userInfoRespond) => localStorage.setItem('userInfo', JSON.stringify(userInfoData)))
      .then(() => history.goBack())
      .finally(() => {
        setLoading(false)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const HandleGetAvatar = () => {
    if (username) {
      fetchData(`${BASEURL}/api/v1/user/avatar?username=${username}`, 'GET')
        .then(({ avatar, nickname }) => {
          setAvatar(avatar)
          setNickname(nickname)
        })
        .catch(() => {})
    } else {
      setAvatar('')
    }
  }

  return (
    <CustomForm>
      {nickname && username ? (
        <div id="avatar">
          <Avatar src={avatar} size={48} />
          <span>{nickname}，欢迎回来！</span>
        </div>
      ) : (
        <h2>使用账号密码登录</h2>
      )}
      <div className="fromContain">
        <div className="form-block">
          <div className="input-row">
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              placeholder="邮箱"
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => HandleGetAvatar()}
            />
          </div>
        </div>
        <div className="form-block">
          <div className="input-row">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="tools">
          <span>忘记密码了？</span>
        </div>
      </div>
      <button onClick={(e) => HandleLogin(e)}>
        {loading && <LoadingOutlined />}
        <span style={{ margin: '0 1em' }}>{loading ? '正在请求' : '登录'}</span>
      </button>
    </CustomForm>
  )
}

function RegisterFrom() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [nickname, setNickName] = useState('')
  const [helloText, setHelloText] = useState('让我们开始吧！')
  const [describeText, setDescribeText] = useState('设置一个用户名')
  const [showDescribe, setShowDescribe] = useState(false)
  const [checkPass, setCheckPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [buttom, setButtom] = useState('创建账号')
  const history = useHistory()

  const HandleRegister = (e: any) => {
    e.preventDefault()
    setLoading(true)
    setButtom('正在请求')
    // 执行注册操作
    fetchData(`${BASEURL}/api/v1/auth/register`, 'POST', undefined, {
      nickname,
      email,
      password,
    })
      .then(({ token }) => {
        // 注册成功，将token写入localStorge
        localStorage.setItem('token', token)
        // 注册成功，获取用户信息
        return fetchData(`${BASEURL}/api/v1/user/userInfo`, 'GET', { token })
      })
      .then((userInfoData: userInfoRespond) => localStorage.setItem('userInfo', JSON.stringify(userInfoData)))
      .then(() => history.push('/'))
      .finally(() => {
        setLoading(false)
      })
      .catch((e) => {
        setButtom('再试一次')
        console.log(e)
      })
  }

  // const HandleVerifyCode = (e: any) => {
  //   e.preventDefault()
  //   setLoading(true)
  //   fetchData(
  //     `${BASEURL}/api/v1/auth/2fa/bound?method=email`,
  //     'POST',
  //     { token: localStorage.getItem('token') },
  //     {
  //       verifyCode,
  //     }
  //   )
  // }

  const checkNickname = () => {
    // 剔除用户名的标点符号
    setEmail(email.replace(/[^a-zA-Z0-9\u4E00-\u9FA5]/g, ''))
  }

  const checkEveryThing = () => {
    if (nickname.length === 0) {
      setHelloText('至少需要告知您的昵称哦')
      setShowDescribe(false)
      return setCheckPass(false)
    }

    setHelloText(`${nickname}，你好呀！`)
    setShowDescribe(true)

    if (password.length === 0) {
      setDescribeText('接下来，设置一个高强度的密码吧！')
      return setCheckPass(false)
    }
    if (password.length <= 8) {
      setDescribeText('密码长度不可低于8位！')
      return setCheckPass(false)
    }
    if (password !== verifyPassword) {
      setDescribeText('哎呀，两次密码不对哦！')
      return setCheckPass(false)
    }
    if (email.length <= 5) {
      setDescribeText('请输入您的邮箱，用于绑定和找回密码')
      return setCheckPass(false)
    }
    if (!email.includes('@')) {
      setDescribeText('哎呀，邮箱格式不对！应该含有@符号！')
      return setCheckPass(false)
    }
    if (!email.includes('.')) {
      setDescribeText('哎呀，邮箱格式不对！应该含有”.“符号！')
      return setCheckPass(false)
    }
    setDescribeText('非常好！您现在可以点击“创建账号”了！')
    setCheckPass(true)
  }

  // const verifyEmailFrom = () => {
  //   return (
  //     <div className="form-block">
  //       <div className="input-row">
  //         <input
  //           type="number"
  //           name="verifyCode"
  //           id="verifyCode"
  //           value={verifyCode}
  //           maxLength={6}
  //           placeholder="验证码"
  //           onChange={(e) => setVerifyCode(e.target.value)}
  //         />
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <CustomForm>
      <h2>{helloText}</h2>
      <span id="describe" style={{ opacity: showDescribe ? 1 : 0, height: showDescribe ? '1rem' : '0rem' }}>
        {describeText}
      </span>
      <div className="fromContain">
        <div className="form-block">
          <div className="input-row">
            <input
              type="text"
              name="nickname"
              id="nickname"
              value={nickname}
              placeholder="昵称（支持中文，最长16位）"
              maxLength={16}
              onChange={(e) => setNickName(e.target.value)}
              onBlur={() => checkEveryThing()}
              onKeyUp={() => checkNickname()}
              onPaste={() => checkNickname()}
              onContextMenu={() => checkNickname()}
            />
          </div>
        </div>
        <div className="form-block">
          <div className="input-row">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => {
                setDescribeText('请再输入一次您的密码以确认无误！')
              }}
            />
          </div>
        </div>
        <div className="form-block">
          <div className="input-row">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="确认密码"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              onBlur={() => {
                checkEveryThing()
              }}
            />
          </div>
        </div>
        <div className="form-block">
          <div className="input-row">
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              placeholder="登录邮箱"
              onChange={(e) => setEmail(e.target.value)}
              onKeyUp={() => checkEveryThing()}
            />
          </div>
        </div>
      </div>
      <button
        onClick={(e) => HandleRegister(e)}
        style={{
          pointerEvents: checkPass && !loading ? 'unset' : 'none',
          backgroundColor: checkPass && !loading ? '#333' : '#888',
        }}
      >
        {loading && <LoadingOutlined />}
        <span style={{ margin: '0 1em' }}>{buttom}</span>
      </button>
    </CustomForm>
  )
}

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  transition: all 0.3s;
  @media all and (min-width: 768px) {
    align-items: center;
  }
  height: 100%;
`
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  transition: 0.3s;
  flex: 1;
  box-shadow: 0 0 13px 8px #f2f2f5;
  overflow: hidden;
  @media all and (min-width: 768px) {
    max-width: 400px;
  }
  @media all and (max-width: 768px) {
    flex: 1;
    height: 100% !important;
  }
`
const TypeSwitcher = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  max-height: 45px;
  .switchButton {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 1.25em;
    transition: all 0.3s;
    overflow: hidden;
    box-sizing: border-box;
    border-bottom: 2px solid #f9f9f9;
    :hover {
      cursor: pointer;
      background-color: #fcfcfc;
    }
  }
  .active {
    border-bottom: 2px solid ${ThemeColor.dark};
  }
`

const CustomForm = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 1.5em;
  h1,
  h2 {
    font-weight: 400;
    text-align: center;
    margin: 0;
  }

  #avatar {
    display: inherit;
    justify-content: center;
    align-items: center;
    span {
      margin: 0 0.25em;
      font-size: 1.25em;
    }
  }

  #describe {
    display: flex;
    font-size: 0.75em;
    justify-content: center;
    transition: all 0.3s;
    color: #9e9e9e;
  }
  div.fromContain {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.75em;
    div.form-block {
      span {
        font-size: 1.1em;
      }
      div.input-row {
        padding: 0.5em;
        border-bottom: 1px solid ${ThemeColor.white};
        margin: 0.5em 0;
        input {
          border: none;
          width: 100%;
          box-sizing: border-box;
          background-color: transparent;
          color: #333;
          outline: none;
        }
      }
    }
    div.tools {
      display: flex;
      justify-content: flex-end;
      transition: all 0.3s;
      color: #848484;
      margin-top: 0.25em;
      :hover {
        cursor: pointer;
        color: #333;
      }
    }
  }

  button {
    display: flex;
    justify-content: center;
    background-color: #333;
    color: #fff;
    border: none;
    padding: 0.5em;
    transition: all 0.3s;
    align-items: center;
    :hover {
      background-color: #525252;
      cursor: pointer;
      transform: scale(1.025);
    }
    :active {
      transform: scale(0.98);
    }
  }
`
