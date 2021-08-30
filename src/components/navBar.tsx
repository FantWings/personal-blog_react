import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router'
import { useUserInfo } from '../utils/hooks'
import { useEffect } from 'react'
import fetchData from '../utils/fetch'
import { BASEURL } from '../config'
import { userInfoRespond } from '../utils/interfaces'

export default function Navbar() {
  const history = useHistory()
  const [userInfo] = useUserInfo()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token)
      fetchData(`${BASEURL}/api/v1/user/userInfo`, 'GET', { token: token }).then(
        (userInfoData: userInfoRespond) => localStorage.setItem('userInfo', JSON.stringify(userInfoData)),
        ({ status }) => {
          if (status === 10) {
            history.push('/login')
          }
        }
      )
  }, [history])

  return (
    <>
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
              {userInfo ? (
                <span>
                  <Avatar icon={!userInfo && <UserOutlined />} src={userInfo.avatar} />
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
      {/* <Tooltip>
        <span>233</span>
      </Tooltip> */}
    </>
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
