import { Route, Switch, Redirect } from 'react-router'
import { NavLink } from 'react-router-dom'

import styled from 'styled-components'

// 导入页面
import PageHome from './pages/PageHome'
import PageArchives from './pages/PageArchives'
import PageEditer from './pages/PageEditor'

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
        </div>
      </NavBar>
      <PageContainer>
        <Switch>
          <Route path="/" component={PageHome} exact></Route>
          <Route path="/archives/:archId" component={PageArchives} exact></Route>
          <Route path="/edit/:archId" component={PageEditer} exact></Route>
          <Redirect to="/" />
        </Switch>
      </PageContainer>
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
      @media all and (max-width: 768px) {
        display: none;
      }
    }

    #navList {
      flex: 1;
      ul {
        @media all and (min-width: 769px) {
          flex: 0.3;
        }
        @media all and (max-width: 768px) {
          flex: 1;
        }

        justify-content: space-evenly;
        align-items: center;
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
    }
  }
`

const PageContainer = styled.div`
  display: flex;
  height: calc(100% - 64px);
  box-sizing: border-box;
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px;
  @media all and (min-width: 768px) {
    padding: 25px;
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
