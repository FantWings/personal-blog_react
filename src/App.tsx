import { Route, Switch, Redirect } from 'react-router'
import { NavLink } from 'react-router-dom'

import styled from 'styled-components'

// 导入页面
import PageArchives from './pages/PageArchives'
import PageHome from './pages/PageHome'

function App() {
  return (
    <div className="App">
      <NavBar>
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
                  技术向
                </NavLink>
              </li>
              <li>
                <NavLink to="/archives/2" activeClassName="currentPage">
                  游戏向
                </NavLink>
              </li>
              <li>
                <NavLink to="/archives/3" activeClassName="currentPage">
                  档案馆
                </NavLink>
              </li>
              <li>
                <NavLink to="/archives/4" activeClassName="currentPage">
                  关于
                </NavLink>
              </li>
            </ul>
          </div>
          <div id="userComponent">
            <span id="avatar"></span>
            <span>用户名称</span>
          </div>
        </div>
      </NavBar>
      <Switch>
        <Route path="/" component={PageHome} exact></Route>
        <Route path="/archives/:archId" component={PageArchives} exact></Route>
        <Redirect to="/" />
      </Switch>
      <Footer>
        <span>Copyright © 2019 粤ICP备20059526号</span>
        <span>Build 0.1a - 00837d7ae1ce50629e91d81f2849c98b. </span>
      </Footer>
    </div>
  )
}

const NavBar = styled.div`
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
    }

    #navList {
      flex: 1;
      ul {
        align-items: center;
        li {
          margin: 0 1rem;
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
    }

    #userComponent {
      align-items: center;
      #avatar {
        width: 40px;
        height: 40px;
        display: block;
        background-color: #f5f5f5;
        border-radius: 100%;
        margin-right: 0.75em;
      }
    }
  }
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em 0;
  color: #adadad;
`

export default App
