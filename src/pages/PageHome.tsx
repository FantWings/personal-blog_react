import { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { Divider, Avatar } from 'antd'

import { ThemeColor } from '../utils/constent'
import { archiveListsInterface, userDataInterface } from '../utils/interfaces'
import fetchData from '../utils/fetch'
import { Link, useNavigate } from 'react-router-dom'
import { BASEURL } from '../config'
// import Widges from '../components/widges'
import TagGroup from '../components/tagGroup'
import { LoadingOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { useUserInfo } from '../utils/hooks'
import { JsxChild, JsxText } from 'typescript'
import { ReactElement } from 'react-markdown/lib/react-markdown'

export default function PageHome() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Array<archiveListsInterface>>([])
  const [userInfo] = useUserInfo()
  // const [tags, setTags] = useState([])
  // const [role, setRole] = useState(0)

  // useEffect(() => {
  //   fetchData(`${BASEURL}/api/v1/user/getRole`, 'GET', { token: localStorage.getItem('token') }).then(
  //     ({ data: role }) => setRole(role)
  //   )
  // }, [])

  useEffect(() => {
    setLoading(true)
    fetchData(`${BASEURL}/api/v1/archive/getList`, 'GET')
      .then((data) => setData(data))
      .finally(() => setLoading(false))
      .catch(({ msg }) => console.log(`博文列表获取失败：${msg}`))
    // 监听URLsearch参数，用于TAG给组件进行触发筛选
  }, [])

  // useEffect(() => {
  //   fetchData(`${BASEURL}/api/v1/archive/getTags`, 'GET')
  //     .then((data) => setTags(data))
  //     .catch(({ msg }) => console.log(`TAG列表获取失败：${msg}`))
  // }, [])

  const loadMore = () => {
    setLoading(true)
    fetchData(`${BASEURL}/api/v1/archive/getList?limit=${data.length + 10}`, 'GET')
      .then((data) => setData(data))
      .finally(() => setLoading(false))
      .catch(({ msg }) => console.log(`博文列表获取失败：${msg}`))
  }

  const filterByTags = (tags: string) => {
    setLoading(true)
    fetchData(`${BASEURL}/api/v1/archive/getList?filter_by=${tags}`, 'GET')
      .then((data) => setData(data))
      .finally(() => setLoading(false))
      .catch(({ msg }) => console.log(msg))
  }

  return (
    <Body>
      <div className="main-left">
        <UnifyContaner title="档案馆" subtitle="Library">
          <div className="ContainerBlock">
            {data.map((data: archiveListsInterface) => {
              const { title, id, update_time, views } = data
              return (
                <Posts>
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
                      <span>发布于 {new Date(update_time).toLocaleString()}</span>
                      <span>最后回复在23小时前</span>
                    </div>
                    <div className="icon-set">
                      <span>阅读：{views}</span>
                      <span>评论：{0}</span>
                    </div>
                  </div>
                </Posts>
              )
            })}
          </div>
        </UnifyContaner>
      </div>

      <div className="main-right">
        {userInfo && (
          <Container className="margin_bottom">
            <div id="addNewBlog">
              <span id="btn_addnew" onClick={() => navigate('/edit')}>
                撰写一个新文章
              </span>
            </div>
          </Container>
        )}
        <Container className="margin_bottom">
          <div id="userCard">
            <div id="info">
              <span id="avatar">
                <Avatar size={64} icon={<UserOutlined />} src={userInfo?.avatar} />
              </span>
              <span id="username">{userInfo?.nickname || '未登录'}</span>
              {userInfo && <span id="email">{userInfo?.email.addr}</span>}
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
  margin: 0 auto;
  display: flex;
  flex: 1;
  justify-content: space-between;
  width: 75%;
  min-width: 760px;
  div.main-left {
    width: calc(100% - 310px);
  }
  div.main-right {
    width: 300px;
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
    span#btn_addnew {
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

const ArchivesContianer = styled.div`
  order: 20;
  flex: 1;
  flex-wrap: wrap;
  @media all and (max-width: 768px) {
    flex-basis: 100%;
  }
`

const AddArchive = styled.div`
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  color: ${ThemeColor.gray};
  cursor: pointer;
  transition: 0.3s;
  margin-bottom: 1em;
  border: 1px dashed ${ThemeColor.gray};
  :hover {
    color: ${ThemeColor.dark};
  }
  span {
    margin: 2px;
  }
`

const ArchivesPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 10px;
  transition: 0.3s;
  max-width: 100vw;
  :hover {
    box-shadow: 0px 0px 10px 5px #f0f0f0;
  }
  .body {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 0.8em;
    .image {
      @media all and (max-width: 768px) {
        display: none;
      }
      background-size: cover;
      border-radius: 0.15rem;
      overflow: hidden;
      span {
        display: block;

        height: 100%;
        min-height: 128px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-color: rgba(120, 120, 120, 0.1);
        @media all and (max-width: 768px) {
          width: 120px;
        }
        @media all and (min-width: 769px) {
          width: 200px;
        }
      }
    }
    .content {
      display: block;
      flex-wrap: wrap;
      padding: 0 0.5rem;
      flex: 1;
      a.title {
        display: block;
        margin-bottom: 0.25em;
        font-weight: 600;
        font-size: 1.25rem;
        transition: 0.3s;
        color: ${ThemeColor.dark};
        text-decoration: none;
        :hover {
          color: #5d96ff;
          cursor: pointer;
        }
      }
      div.text {
        display: -webkit-box;
        font-size: 0.85rem;
        color: ${ThemeColor.gray};
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
        @media all and (max-width: 454px) {
          max-width: 80vw;
        }
      }
    }
  }

  .footer {
    display: flex;
    flex: 1 100%;
    font-size: 0.75rem;
    color: ${ThemeColor.gray};
    align-items: flex-end;
    justify-content: space-between;
    @media all and (max-width: 414px) {
      flex-direction: column;
      align-items: end;
      ul.tags {
        margin-top: 0.75em;
      }
    }
    .info {
      li {
        margin: 0 0.5em;
        line-height: 2;
      }
    }
  }
`
const Loadmore = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 100%;
  height: 64px;

  background-color: #fff;
  color: ${ThemeColor.gray};
  cursor: pointer;
  transition: 0.3s;
  :hover {
    color: ${ThemeColor.dark};
  }
`

// const WidgesContainer = styled.div`
//   display: flex;
//   flex: 1;
//   min-width: 260px;
//   @media all and (min-width: 769px) {
//     order: 30;
//     margin-left: 10px;
//     flex: 0.3;
//   }

//   @media all and (max-width: 768px) {
//     order: 11;
//     margin-bottom: 1em;
//   }
// `
