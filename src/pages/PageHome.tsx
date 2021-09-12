import { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

import { ThemeColor } from '../utils/constent'
import { archivePreviewRespond } from '../utils/interfaces'
import fetchData from '../utils/fetch'
import { Link, useHistory } from 'react-router-dom'
import { BASEURL } from '../config'
// import Widges from '../components/widges'
import TagGroup from '../components/tagGroup'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { useUserInfo } from '../utils/hooks'

export default function PageHome() {
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Array<archivePreviewRespond>>([])
  // const [tags, setTags] = useState([])
  // const [role, setRole] = useState(0)

  // useEffect(() => {
  //   fetchData(`${BASEURL}/api/v1/user/getRole`, 'GET', { token: localStorage.getItem('token') }).then(
  //     ({ data: role }) => setRole(role)
  //   )
  // }, [])

  const [userInfo] = useUserInfo()

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
    <>
      {/* {localStorage.getItem('loggedIn') && localStorage.getItem('email') === '' && (
        <NoticeBar>
          <span>
            您需要验证您的邮箱才可以发布回复、订阅、留言等操作。 <span id="verifyBtn">前往验证</span>
          </span>
        </NoticeBar>
      )} */}
      <ArchivesContianer>
        {userInfo?.role === 10 && (
          <AddArchive onClick={() => history.push('/add', { edit: false })}>
            <PlusOutlined />
            <span>撰写新文章</span>
          </AddArchive>
        )}
        {data.map(
          ({ id, cover_image, title, preview, views, time_for_read, update_time, tags }: archivePreviewRespond) => {
            return (
              <ArchivesPreview key={id}>
                <div className="body">
                  <div className="image">
                    <span
                      style={{
                        backgroundImage: `url(${cover_image || 'thumbnail.png'})`,
                      }}
                    />
                  </div>
                  <div className="content">
                    <Link className="title" to={`/archives/${id}`}>
                      {title}
                    </Link>
                    <span className="text">{preview}</span>
                  </div>
                </div>
                <div className="footer">
                  <ul className="info disableDefaultListStyle">
                    <li>阅读量：{views}</li>
                    <li>阅读时间：{time_for_read}分钟</li>
                    <li>最后更新：{new Date(update_time).toLocaleString()}</li>
                  </ul>
                  <TagGroup tags={tags} handleUpdate={filterByTags} />
                </div>
              </ArchivesPreview>
            )
          }
        )}
        <Loadmore style={{ cursor: loading ? 'wait' : 'pointer' }} onClick={() => loadMore()}>
          {loading ? <LoadingOutlined /> : '加载更多'}
        </Loadmore>
      </ArchivesContianer>
      {/* <WidgesContainer>
        <Widges title="标签筛选">
          <TagGroup tags={tags} handleUpdate={filterByTags} style={{ marginBottom: '1em' }} />
        </Widges>
      </WidgesContainer> */}
    </>
  )
}

// const NoticeBar = styled.div`
//   flex: 1 100%;
//   padding: 0.75em;
//   margin-bottom: 0.75em;
//   background-color: #fff2cf;
//   color: #d8b550;
//   order: 10;
//   span#verifyBtn {
//     color: #909eff;
//     transition: all 0.3s;
//     :hover {
//       color: #7c8efd;
//       cursor: pointer;
//     }
//   }
// `

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
      padding: 0 1rem;
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
      span.text {
        font-size: 0.85rem;
        color: ${ThemeColor.gray};
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        display: -webkit-box;
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
    @media all and (max-width: 768px) {
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
