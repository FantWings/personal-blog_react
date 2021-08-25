import { Route, Switch, Redirect } from 'react-router'

import styled from 'styled-components'

// 导入页面
import PageHome from './pages/PageHome'
import PageArchives from './pages/PageArchives'
import PageEditer from './pages/PageEditor'
import PageLogin from './pages/PageLogin'
import Navbar from './components/navBar'

export default function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} exact />
      <Route path="/" component={App} />
    </Switch>
  )
}

function Login() {
  return <PageLogin />
}

function App() {
  return (
    <div className="App">
      <Navbar />
      <PageContainer>
        <Switch>
          <Route path="/" component={PageHome} exact></Route>
          <Route path="/archives/:archId" component={PageArchives} exact></Route>
          <Route path="/edit" component={PageEditer} exact></Route>
          <Route path="/add" component={PageEditer} exact></Route>
          <Redirect to="/" />
        </Switch>
      </PageContainer>
      <Footer>
        {/* <span>Copyright © 2019 粤ICP备20059526号</span>
        <span>Build 0.1a - 00837d7ae1ce50629e91d81f2849c98b. </span> */}
      </Footer>
    </div>
  )
}

const PageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: calc(100% - 64px);
  box-sizing: border-box;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  @media all and (min-width: 768px) {
    padding: 25px;
  }
  /* @media all and (max-width: 768px) {
    flex-wrap: wrap;
    flex-direction: column-reverse;
  } */
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em 0;
  color: #adadad;
`
