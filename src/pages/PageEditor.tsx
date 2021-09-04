import { useHistory, useLocation } from 'react-router'
import MdEditor from 'react-markdown-editor-lite'
import Markdown from 'react-markdown'
import gfm from 'remark-gfm'

import 'react-markdown-editor-lite/lib/index.css'
import { useState } from 'react'
import { useEffect } from 'react'
import fetchData from '../utils/fetch'
import { BASEURL } from '../config'
import { ThemeColor } from '../utils/constent'
import styled from 'styled-components'
import { message } from 'antd'
import { blogDetailRespond } from '../utils/interfaces'
import { CloseOutlined } from '@ant-design/icons'

export default function PageEditer() {
  const location = useLocation<{ edit: boolean; archId: number | undefined }>()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState<string | undefined>('')
  const [tags, setTags] = useState<Array<string>>([])
  const [tagsFormText, setTagsFromText] = useState<string>('')
  const [coverImage, setCoverImage] = useState('')

  const { edit, archId } = location.state
  const history = useHistory()

  // 初始加载函数，用来向服务器获取要修改的文章对应的数据
  useEffect(() => {
    edit &&
      fetchData(`${BASEURL}/api/v1/archive/getDetail/${archId}`, 'GET')
        .then(({ content, title, coverImage, tags }: blogDetailRespond) => {
          setContent(content)
          setTitle(title)
          setCoverImage(coverImage)
          setTags(tags)
        })
        .catch(({ status }) => {
          if (status === 10) return history.push('/login')
        })
  }, [edit, archId, history])

  // 新建模式提交函数，点击提交后，将数据收集给服务器
  const HandleSubmit = () => {
    const body = { title, content, cover_image: coverImage, time_for_read: 5, tags }
    fetchData(`${BASEURL}/api/v1/archive/add`, 'POST', { token: localStorage.getItem('token') }, body)
      .then(() => {
        message.success('操作成功')
        history.push('/')
      })
      .catch(({ status }) => {
        if (status === 10) history.push('/login')
      })
  }

  // 修改模式提交函数，点击提交后，将数据收集给服务器
  const HandleUpdate = () => {
    const body = { title, content, cover_image: coverImage, time_for_read: 5, tags }
    fetchData(
      `${BASEURL}/api/v1/archive/update?archId=${archId}`,
      'POST',
      { token: localStorage.getItem('token') },
      body
    )
      .then(() => {
        message.success('操作成功')
        history.push(`/archives/${archId}`)
      })
      .catch(({ status }) => {
        if (status === 10) return history.push('/login')
      })
  }

  // 标签添加函数，监听回车键，将新tag插入到tags状态中
  const handleKeyPress = ({ charCode }: { charCode: number }) => {
    if (charCode === 13) {
      setTags((prev) => {
        if (prev.indexOf(tagsFormText) < 0) {
          prev.splice(0, 0, tagsFormText)
        }
        return [...prev]
      })
      setTagsFromText('')
    }
  }

  // 标签删除函数，从tags状态里删除对应的tag
  const handleDeleteTagFromTagGroup = (index: number) => {
    setTags((prev) => {
      prev.splice(index, 1)
      return [...prev]
    })
  }

  // 页面主体
  return (
    <div style={{ width: '100%' }}>
      <EditContainer>
        <div id="title">
          <span>{edit ? '编辑文章' : '撰写新文章'}</span>
          <button onClick={edit ? HandleUpdate : HandleSubmit}>提交</button>
        </div>
        <input
          type="text"
          id="archiveTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="文章标题"
        />
        <MdEditor
          value={content}
          renderHTML={(content: string) => {
            return <Markdown children={content} remarkPlugins={[gfm]} />
          }}
          onChange={(e) => setContent(e.text)}
          style={{ height: '600px' }}
        />
        <div id="extraInfo">
          <div className="extraContent">
            <h3>封面图地址</h3>
            <input
              type="text"
              name="设置文章封面图"
              id="coverImage"
              onChange={(e) => setCoverImage(e.target.value)}
              value={coverImage}
            />
          </div>
          <div className="extraContent">
            <h3>文章标签</h3>
            <input
              type="text"
              name="设置文章标签"
              id="ArchivesTags"
              onKeyPress={(e) => handleKeyPress(e)}
              value={tagsFormText}
              onChange={(e) => setTagsFromText(e.target.value)}
            />
            <div id="tagsGroup">
              {tags.map((tag, index) => {
                return (
                  <div className="tag" key={index}>
                    {tag}
                    <CloseOutlined onClick={() => handleDeleteTagFromTagGroup(index)} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </EditContainer>
    </div>
  )
}

const EditContainer = styled.div`
  flex: 1;
  padding: 1em;
  div#title {
    display: flex;
    margin-bottom: 1.5em;
    justify-content: space-between;
    span {
      flex: 0.88;
      font-size: 1.5em;
      font-weight: 600;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    button {
      flex: 0.12;
      border: none;
      background: ${ThemeColor.dark};
      color: ${ThemeColor.white};
      padding: 0.3em 0.6em;
      border-radius: 0.2em;
      transition: 0.3s;
      margin-left: 5px;
      :hover {
        cursor: pointer;
        background-color: #545880;
      }
      :active {
        background-color: #000;
      }
    }
  }
  #archiveTitle {
    display: flex;
    margin: 1em 0;
    outline: none;
    border: 1px #d2d2d2 solid;
    width: 100%;
    height: 1.75em;
    font-size: 1.5em;
    padding: 0.25em;
  }
  #extraInfo {
    margin-top: 2em;
    div.extraContent {
      margin: 1em;
      input {
        border: 1px #d2d2d2 solid;
        padding: 0.25em;
        width: 100%;
      }
    }
    div#tagsGroup {
      display: flex;
      flex-wrap: wrap;
      margin-top: 8px;
      div.tag {
        background-color: #e2e2e2;
        margin-right: 8px;
        padding: 3px 10px;
        border-radius: 3px;
        margin-top: 6px;
        transition: all 0.3s;
        :hover {
          transform: scale(1.1);
          background-color: #cccccc;
        }
        :active {
          transform: scale(1.05);
        }
        span {
          margin-left: 6px;
          :hover {
            cursor: pointer;
          }
        }
      }
    }
  }
`
