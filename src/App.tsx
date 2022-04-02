import { Route, Routes } from 'react-router'

import styled from 'styled-components'

// 导入页面
import PageHome from './pages/PageHome'
import PageArchives from './pages/PageArchives'
import PageEditer from './pages/PageEditor'
import PageLogin from './pages/PageLogin'
import PageTest from './pages/PageTest'
import Navbar from './components/navBar'
import Footer from './components/footer'

export function LoginPage() {
  return <PageLogin />
}

export function MainPage() {
  return (
    <div className="App">
      <Navbar />
      <PageContainer>
        <Routes>
          <Route path="/" element={<PageHome />}></Route>
          <Route path="/archives/:archId" element={<PageArchives />}></Route>
          <Route path="/edit" element={<PageEditer />}></Route>
          <Route path="/test" element={<PageTest />}></Route>
        </Routes>
      </PageContainer>
      <Footer />
    </div>
  )
}

const PageContainer = styled.div`
  /* display: flex; */
  /* flex-wrap: wrap; */
  //body高度 = 100视口 - 64导航栏高度 - 64页脚高度
  min-height: calc(100vh - 64px - 64px);
  box-sizing: border-box;
  max-width: 100vw;
  margin: 0 auto;
  padding: 18px 0 32px 0;
  /* @media all and (min-width: 768px) {
    justify-content: space-between;
    padding: 25px;
    max-width: 1200px;
  } */
  /* @media all and (max-width: 768px) {
    flex-wrap: wrap;
    flex-direction: column-reverse;
  } */
`
