import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ThemeColor } from '../utils/constent'
import { message } from 'antd'
import { fetchData } from '../utils/fetch'
import { BASEURL } from '../config'

import { LoadingOutlined } from '@ant-design/icons'

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
          {/* <button onClick={() => setType(1)}>Switch</button> */}
        </TypeSwitcher>
        <>{type ? <RegisterFrom /> : <LoginForm />}</>
      </LoginContainer>
    </PageContainer>
  )
}

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loading) return message.loading({ content: '请稍等', key: 'loading' })
    return message.destroy('loading')
  }, [loading])

  const HandleLogin = (e: any) => {
    e.preventDefault()
    setLoading(true)
    fetchData(`${BASEURL}/api/v1/auth/login`, 'POST', undefined, {
      username,
      password,
    }).then(() => setLoading(false))
  }
  return (
    <CustomForm>
      <h2>使用账号密码登录</h2>
      <div className="fromContain">
        <div className="form-block">
          <div className="input-row">
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              placeholder="用户名或邮箱"
              onChange={(e) => setUsername(e.target.value)}
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
      <button onClick={(e) => HandleLogin(e)}>登录</button>
    </CustomForm>
  )
}

function RegisterFrom() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [email, setEmail] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [helloText, setHelloText] = useState('让我们开始吧！')
  const [describeText, setDescribeText] = useState('设置一个用户名')
  const [showDescribe, setShowDescribe] = useState(false)
  const [checkPass, setCheckPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifyStage, setVerifyStage] = useState(false)

  const HandleRegister = (e: any) => {
    e.preventDefault()
    setLoading(true)
    fetchData(`${BASEURL}/api/v1/auth/register`, 'POST', undefined, {
      username,
      password,
      email,
    })
      .then((data) => {
        console.log(data)
        data && localStorage.setItem('token', data.token)

        setLoading(false)
        fetchData(`${BASEURL}/api/v1/auth/2fa/sendVerifyCode?method=email&value=${email}`, 'GET', {
          token: localStorage.getItem('token'),
        })
      })
      .then(() => {
        setVerifyStage(true)
        setHelloText('验证您的邮箱')
        setDescribeText(`已向${email}发送了一封邮件验证码`)
      })
  }

  const HandleVerifyCode = (e: any) => {
    e.preventDefault()
    setLoading(true)
    fetchData(
      `${BASEURL}/api/v1/auth/2fa/bound?method=email`,
      'POST',
      { token: localStorage.getItem('token') },
      {
        verifyCode,
      }
    )
  }

  const checkUsername = () => {
    setUsername(username.replace(/[^a-zA-Z0-9\u4E00-\u9FA5]/g, ''))
  }

  const checkEveryThing = () => {
    if (username.length === 0) {
      setHelloText('至少需要告知我用户名哦')
      setShowDescribe(false)
      return setCheckPass(false)
    }

    setHelloText(`${username}，你好呀！`)
    setShowDescribe(true)

    if (password.length === 0) {
      setDescribeText('接下来，设置一个高强度的密码吧！')
      return setCheckPass(false)
    }
    if (password !== verifyPassword) {
      setDescribeText('哎呀，两次密码不对哦！')
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

  const verifyEmailFrom = () => {
    return (
      <div className="form-block">
        <div className="input-row">
          <input
            type="number"
            name="verifyCode"
            id="verifyCode"
            value={verifyCode}
            maxLength={6}
            placeholder="验证码"
            onChange={(e) => setVerifyCode(e.target.value)}
          />
        </div>
      </div>
    )
  }

  const regFrom = () => {
    return (
      <>
        <div className="form-block">
          <div className="input-row">
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              placeholder="用户名（支持中文，最长16位）"
              maxLength={16}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => checkEveryThing()}
              onKeyUp={() => checkUsername()}
              onPaste={() => checkUsername()}
              onContextMenu={() => checkUsername()}
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
              name="password"
              id="password"
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
              placeholder="绑定邮箱"
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => checkEveryThing()}
            />
          </div>
        </div>
      </>
    )
  }

  return (
    <CustomForm>
      <h2>{helloText}</h2>
      <span id="describe" style={{ opacity: showDescribe ? 1 : 0, height: showDescribe ? '1rem' : '0rem' }}>
        {describeText}
      </span>
      <div className="fromContain">{verifyStage ? verifyEmailFrom() : regFrom()}</div>
      <button
        onClick={(e) => (verifyStage ? HandleVerifyCode(e) : HandleRegister(e))}
        style={{
          pointerEvents: checkPass && !loading ? 'unset' : 'none',
          backgroundColor: checkPass && !loading ? '#333' : '#888',
        }}
      >
        {loading && <LoadingOutlined />}
        <span style={{ margin: '0 1em' }}>{loading ? '正在请求' : '创建账号'}</span>
      </button>
    </CustomForm>
  )
}

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
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
