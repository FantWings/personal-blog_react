import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import fetchData from '../utils/fetch'
import { BASEURL } from '../config'

export default function Navbar() {
  const history = useHistory()
  const token = localStorage.getItem('token')
  const [loggedIn, setLoggedIn] = useState(false)
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    fetchData(`${BASEURL}/api/v1/user/userInfo`, 'GET', { token }).then(
      ({ avatar }) => {
        setAvatar(avatar)
        setLoggedIn(true)
      },
      ({ status }) => {
        if (status === 10) setLoggedIn(false)
      }
    )
  }, [token])

  return (
    <NavContainer>
      <div>
        <div id="siteTittle">
          <span>我的React博客</span>
        </div>

        <div id="navList">
          <ul className="disableDefaultListStyle">
            <li>
              <NavLink to="/" activeClassName="currentPage">
                首页
              </NavLink>
            </li>
            <li>
              <NavLink to="/" activeClassName="currentPage">
                时间轴
              </NavLink>
            </li>
            <li>
              <NavLink to="/" activeClassName="currentPage">
                小工具
              </NavLink>
            </li>
            <li>
              <NavLink to="/" activeClassName="currentPage">
                档案馆
              </NavLink>
            </li>
          </ul>
          <div id="userBlock">
            {loggedIn ? (
              <span onClick={() => history.push('/profile')}>
                <Avatar icon={!avatar && <UserOutlined />} src={avatar} />
              </span>
            ) : (
              <span id="loginBtn" onClick={() => history.push('/login')}>
                登录
              </span>
            )}
          </div>
        </div>
      </div>
    </NavContainer>
  )
}

const NavContainer = styled.div`
  box-shadow: 1px 0 10px #e7e7e7;
  background-color: #fff;
  position: relative;
  div {
    display: flex;
    margin: 0 16px;
    min-height: 64px;
    #siteTittle {
      justify-content: center;
      align-items: center;
      margin: 0 1.25rem;
      font-size: 1.25rem;
      @media all and (max-width: 768px) {
        display: none;
      }
    }
    #navList {
      flex: 1;
      align-items: center;
      justify-content: space-between;
      ul {
        flex: 1;
        justify-content: space-evenly;
        @media all and (min-width: 769px) {
          max-width: 380px;
        }
        li {
          position: relative;
          a {
            text-decoration: none;
            color: #adadad;
            font-size: 0.875rem;
            transition: 0.3s;
            :hover {
              color: #575757;
            }
          }
        }
      }
      div#userBlock {
        align-items: center;
        span#loginBtn {
          padding: 4px 10px;
          background-color: #f3f3f3;
          border-radius: 2px;
          color: #8d99ae;
          transition: all 0.3s;
          :hover {
            cursor: pointer;
            background-color: #333;
            color: #fff;
          }
        }
      }
    }
  }
`
