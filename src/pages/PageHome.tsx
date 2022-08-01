import { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Divider, Avatar } from 'antd'

import fetchData from '../utils/fetch'
import Loading from '../components/loading'
import { archiveListsInterface } from '../utils/interfaces'
import { BASEURL } from '../config'
import { PlusOutlined, UserOutlined } from '@ant-design/icons'
import { AuthContext } from '../context/authContextProvider'

export default function PageHome() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Array<archiveListsInterface>>([])
  const {
    userInfo: { nickname, avatar, email },
    loggedIn,
  } = useContext(AuthContext)

  // 首屏获取数据
  useEffect(() => {
    setLoading(true)
    fetchData(`${BASEURL}/v1/archive/getList`, 'GET')
      .then((data) => setData(data))
      .finally(() => setLoading(false))
      .catch(({ msg }) => console.log(`博文列表获取失败：${msg}`))
    // 监听URLsearch参数，用于TAG给组件进行触发筛选
  }, [])

  // const loadMore = () => {
  //   setLoading(true)
  //   fetchData(`${BASEURL}/v1/archive/getList?limit=${data.length + 10}`, 'GET')
  //     .then((data) => setData(data))
  //     .finally(() => setLoading(false))
  //     .catch(({ msg }) => console.log(`博文列表获取失败：${msg}`))
  // }

  // const filterByTags = (tags: string) => {
  //   setLoading(true)
  //   fetchData(`${BASEURL}/v1/archive/getList?filter_by=${tags}`, 'GET')
  //     .then((data) => setData(data))
  //     .finally(() => setLoading(false))
  //     .catch(({ msg }) => console.log(msg))
  // }

  return (
    <Body>
      <div className="main-left">
        <UnifyContaner title="档案馆" subtitle="Library">
          <div className="ContainerBlock">
            <Loading loading={loading} />
            {data.map((data: archiveListsInterface) => {
              const { title, id, update_time, views, create_time, comments } = data
              return (
                <Posts key={id}>
                  <div className="post-title">
                    <span
                      className="title"
                      onClick={() => {
                        navigate(`/archives/${id}`)
                      }}
                    >
                      {title}
                    </span>
                  </div>
                  <div className="post-info">
                    <div className="data-set">
                      <span>发布时间： {new Date(create_time).toLocaleString()}</span>
                      <span>最后更新：{new Date(update_time).toLocaleString()}</span>
                    </div>
                    <div className="icon-set">
                      <span>阅读：{views}</span>
                      <span>评论：{comments}</span>
                    </div>
                  </div>
                </Posts>
              )
            })}
          </div>
        </UnifyContaner>
      </div>

      <div className="main-right">
        {loggedIn && (
          <Container className="margin_bottom">
            <div id="addNewBlog">
              <div id="btn_addnew" onClick={() => navigate('/edit')}>
                <PlusOutlined style={{ marginRight: '0.5em' }} />
                <span>撰写一个新文章</span>
              </div>
            </div>
          </Container>
        )}
        <Container className="margin_bottom">
          <div id="userCard">
            <div id="info">
              <span id="avatar">
                <Avatar size={64} icon={<UserOutlined />} src={avatar} />
              </span>
              <span id="username">{nickname || '未登录'}</span>
              {<span id="email">{email.addr}</span>}
            </div>
            <div id="user_oprate">
              <ul>
                <li>编辑资料</li>
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </Body>
  )
}

function UnifyContaner(props: any) {
  return (
    <Container>
      <div className="ContainerBlock">
        <span className="title">{props.title}</span>
        <span className="subtitle">{props.subtitle}</span>
      </div>
      <Divider dashed style={{ margin: 0 }} />
      <>{props.children}</>
    </Container>
  )
}

const Body = styled.div`
  margin: 0 10px;
  display: flex;
  flex: 1;
  justify-content: space-between;
  /* width: 75%;
  min-width: 760px; */
  div.main-left {
    @media screen and (min-width:768px) {
      width: calc(100% - 310px);
    }
  }
  div.main-right {
    width: 300px;
    @media screen and (max-width: 768px){
      display: none;
    }
  }
`

const Container = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 1px 1px #333;
  box-shadow: 0px 2px 4px 0px #e9e9e9; // 上边距
  &.margin_top {
    margin-top: 10px;
  }
  // 下边距
  &.margin_bottom {
    margin-bottom: 10px;
  }
  // 添加新文章
  div#addNewBlog {
    padding: 16px;
    div#btn_addnew {
      transition: 0.3s;
      display: block;
      margin: 2px;
      padding: 16px;
      background-color: #4085f4;
      color: #fff;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      box-shadow: 0px 2px 4px 0px #c5ddff;
      :hover {
        background-color: #76aaff;
      }
      :active {
        background-color: #3670ce;
      }
    }
  }
  // 用户卡
  #userCard {
    padding: 32px 0;
    #info {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      #avatar {
        margin: 16px;
      }
      #username {
        flex: 1 100%;
        text-align: center;
      }
      #email {
        flex: 1 100%;
        text-align: center;
        font-size: 12px;
      }
    }
    #user_oprate {
      padding-top: 32px;
      ul {
        list-style: none;
        text-align: center;
        display: flex;
        justify-content: space-evenly;
        padding: 0;
        li {
          color: #4085f4;
          cursor: pointer;
          transition: 0.3s;
          :hover {
            color: #76aaff;
          }
        }
      }
    }
  }
  // 主页内容模块
  div.ContainerBlock {
    padding: 16px;
    span.title {
      font-size: 1.75em;
      font-weight: 500;
      margin-right: 5px;
    }
    span.subtitle {
      color: #a4a4a4;
      margin-left: 5px;
    }
    div#loadingState {
    }
  }
`

const Posts = styled.div`
  padding: 12px;
  div.post-title {
    display: flex;
    span.title {
      font-size: 18px;
      font-weight: 500;
      cursor: pointer;
      transition: 0.3s;
      margin-bottom: 4px;
      :hover {
        color: #1f75ff;
      }
    }
  }
  div.post-info {
    display: flex;
    justify-content: space-between;
    color: #a4a4a4;
    @media screen and (max-width:768px){
      flex-wrap: wrap;
    }
    div.data-set {
      span {
        margin-right: 12px;
      }
    }
    div.icon-set {
      span {
        margin-right: 12px;
      }
    }
  }
`
