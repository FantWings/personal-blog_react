import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { Avatar, message } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router'
import { useUserInfo } from '../utils/hooks'
import fetchData from '../utils/fetch'
import { BASEURL } from '../config'

export default function Navbar() {
  const history = useHistory()
  const [userInfo] = useUserInfo()

  const HandleLogout = () => {
    const token = localStorage.getItem('token')
    fetchData(`${BASEURL}/api/v1/auth/logout`, 'GET', { token })
      .then(() => localStorage.clear())
      .then(() => history.go(0))
  }

  return (
    <>
      <NavContainer>
        <div id="navBar">
          <div id="siteTittle">
            <span>小翼的档案馆</span>
          </div>

          <div id="navList">
            <ul className="disableDefaultListStyle">
              <li>
                <NavLink to="/" activeClassName="currentPage">
                  <span>博客</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/" activeClassName="currentPage">
                  <span onClick={() => message.warn('很抱歉！前方依然在施工哦，以后再来吧！')}>时间轴</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/" activeClassName="currentPage">
                  <span onClick={() => message.warn('很抱歉！前方依然在施工哦，以后再来吧！')}>小工具</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/" activeClassName="currentPage">
                  <span onClick={() => message.warn('很抱歉！前方依然在施工哦，以后再来吧！')}>关于</span>
                </NavLink>
              </li>
            </ul>
            <div id="userBlock">
              {userInfo ? (
                <div className="user-dropdown">
                  <Avatar icon={!userInfo && <UserOutlined />} src={userInfo.avatar} />
                  <ul className="dropdown-content">
                    <li onClick={() => HandleLogout()}>
                      <LogoutOutlined />
                      <span>退出登录</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <span id="loginBtn" onClick={() => history.push('/login')}>
                  登录
                </span>
              )}
            </div>
          </div>
        </div>
      </NavContainer>
    </>
  )
}

const NavContainer = styled.div`
  box-shadow: 1px 0 10px #e7e7e7;
  background-color: #fff;
  position: relative;
  div#navBar {
    min-height: 64px;
    display: flex;
    margin: 0 16px;
    align-items: center;
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
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      margin: 0 16px;
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
        :hover {
          cursor: pointer;
        }
        :hover div.user-dropdown ul.dropdown-content {
          max-height: 100px;
          transition: max-height 0.3s ease-in;
        }

        div.user-dropdown {
          ul.dropdown-content {
            display: flex;
            position: absolute;
            background-color: #fff;
            right: 32px;
            box-shadow: 0px 0px 16px 4px #f1f1f1;
            border-radius: 5px;
            top: 56px;
            justify-content: flex-end;
            align-items: center;
            min-height: inherit;
            list-style: none;
            padding: 0;
            transition: max-height 0.3s ease-out;
            max-height: 0;
            overflow: hidden;
            li {
              span[role='img'] {
                margin-right: 8px;
              }
              transition: all 0.3s;
              padding: 6px 24px;
              margin: 6px 0;
              /* border-radius: 5px; */
              :hover {
                background-color: #f5f5f5;
                cursor: pointer;
                color: red;
              }
            }
          }
        }

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
