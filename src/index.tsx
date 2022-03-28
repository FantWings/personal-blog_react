import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'antd/dist/antd.min.css'

import './index.css'
import { LoginPage, MainPage } from './App'

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<MainPage />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
)
