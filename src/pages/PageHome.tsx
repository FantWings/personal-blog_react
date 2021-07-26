import { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

import { ThemeColor } from '../utils/constent'
import { archivePreviewRespond } from '../utils/interfaces'
import { fetchData } from '../utils/fetch'
import { Link, useHistory } from 'react-router-dom'
import { BASEURL } from '../config'
import Widges from '../components/widges'
import IconButton from '../components/iconButton'
import TagGroup from '../components/tagGroup'

export default function PageHome() {
  return (
    <>
      <ArchivesPreviewComponent />
      <div style={{ flex: '0.3' }}>
        <Widges title="博客管理">
          <BottomGroup>
            <IconButton text="按钮" />
            <IconButton text="按钮" />
            <IconButton text="按钮" />
            <IconButton text="按钮" />
            <IconButton text="按钮" />
          </BottomGroup>
        </Widges>
        <Widges title="标签筛选">
          <FilterByTagsComponent />
        </Widges>
      </div>
    </>
  )
}

// 博客主页预览组件
function ArchivesPreviewComponent() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<[archivePreviewRespond]>([
    {
      id: 0,
      title: '加载中',
      preview: '正在请求文章内容。',
      lastupdate: '1979-11-24',
      view: 56,
      comment: 97,
      image: 'http://dummyimage.com/180x150',
      tag: ['ammqnjdju', 'iiqjg', 'qdykhr', 'alzu', 'ftlqsd'],
      timeForRead: 11,
    },
  ])
  const history = useHistory()

  useEffect(() => {
    fetchData(`${BASEURL}/api/v1/getArchivesList${history.location.search}`).then((data) => {
      if (data) {
        setData(data)
        setLoading(false)
      }
    })
    // 监听URLsearch参数，用于TAG给组件进行触发筛选
  }, [history.location.search])

  return (
    <div style={{ flex: '0.7' }}>
      {!loading &&
        data.map((arch) => {
          return (
            <ArchivesPreview key={arch.id}>
              <div className="body">
                <div className="image">
                  <span
                    style={{
                      backgroundImage: `url(${arch.image})`,
                    }}
                  />
                </div>
                <div className="content">
                  <Link className="title" to={`/archives/${arch.id}`}>
                    {arch.title}
                  </Link>
                  <span className="text">{arch.preview}</span>
                </div>
              </div>
              <div className="footer">
                <ul className="info disableDefaultListStyle">
                  <li>阅读量：{arch.view}</li>
                  <li>阅读时间：{arch.timeForRead}分钟</li>
                  <li>最后更新：{arch.lastupdate}</li>
                </ul>
                <TagGroup tags={arch.tag} />
              </div>
            </ArchivesPreview>
          )
        })}
    </div>
  )
}

function FilterByTagsComponent() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData(`${BASEURL}/api/v1/getArchivesTags`).then((data) => setData(data))
  }, [])
  return <TagGroup tags={data} style={{ marginBottom: '1em' }} />
}

const ArchivesPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 10px;
  margin-right: 10px;
  transition: 0.3s;
  :hover {
    box-shadow: 0px 0px 20px -5px rgb(158 158 158 / 22%);
  }
  .body {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 0.8em;
    .image {
      background-size: cover;
      border-radius: 0.15rem;
      overflow: hidden;
      span {
        display: block;
        width: 200px;
        height: 100%;
        min-height: 128px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-color: rgba(120, 120, 120, 0.1);
      }
    }
    .content {
      display: block;
      flex-wrap: wrap;
      padding: 0 1rem;
      flex: 1;
      .title {
        display: block;
        margin-bottom: 0.75em;
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
      .text {
        font-size: 0.85rem;
        color: ${ThemeColor.gray};
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
    .info {
      li {
        margin: 0 0.5em;
      }
    }
  }
`

const BottomGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
`
