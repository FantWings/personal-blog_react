import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import fetchData from '../utils/fetch'
// import { fetchData } from '../utils/fetch'
// import { BASEURL } from '../config'
import { BASEURL } from '../config'

export default function Navbar() {
  const history = useHistory()
  const token = localStorage.getItem('token')
  const loggedIn = localStorage.getItem('loggedIn')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    loggedIn && fetchData(`${BASEURL}/api/v1/user/userInfo`, 'GET', { token }).then(({ avatar }) => setAvatar(avatar))
  }, [loggedIn, token])

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
              <NavLink to="/archives/1" activeClassName="currentPage">
                时间轴
              </NavLink>
            </li>
            <li>
              <NavLink to="/archives/2" activeClassName="currentPage">
                小工具
              </NavLink>
            </li>
            <li>
              <NavLink to="/archives/3" activeClassName="currentPage">
                档案馆
              </NavLink>
            </li>
          </ul>
          <div
            id="userBlock"
            onClick={() => (localStorage.getItem('loggedIn') ? history.push('/profile') : history.push('/login'))}
          >
            <Avatar icon={avatar || <UserOutlined />} src={avatar} />
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
      #userBlock {
        align-items: center;
        :hover {
          cursor: pointer;
        }
      }
    }
  }
`
