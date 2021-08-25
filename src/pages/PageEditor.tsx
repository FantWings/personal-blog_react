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

export default function PageEditer() {
  const location = useLocation<{ edit: boolean; archId: number | undefined }>()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState<string | undefined>('')
  const { edit, archId } = location.state
  const history = useHistory()

  useEffect(() => {
    edit &&
      fetchData(`${BASEURL}/api/v1/archive/getDetail/${archId}`, 'GET')
        .then(({ content, title }: blogDetailRespond) => {
          setContent(content)
          setTitle(title)
        })
        .catch(({ status }) => {
          if (status === 10) return history.push('/login')
        })
  }, [edit, archId, history])

  const HandleSubmit = () => {
    const body = { title, content, cover_image: '', time_for_read: 5 }
    fetchData(`${BASEURL}/api/v1/archive/add`, 'POST', { token: localStorage.getItem('token') }, body)
      .then(() => {
        message.success('操作成功')
        history.push('/')
      })
      .catch(({ status }) => {
        if (status === 10) history.push('/login')
      })
  }

  const HandleUpdate = () => {
    const body = { title, content, cover_image: '', time_for_read: 5 }
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
          <div id="coverImage">
            <h3>封面图地址</h3>
            <input type="text" name="设置文章封面图" id="coverImage" />
          </div>
          <div id="coverImage">
            <h3>封面图地址</h3>
            <input type="text" name="设置文章封面图" id="coverImage" />
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
    div {
      margin: 1em;
      input {
        border: 1px #d2d2d2 solid;
        padding: 0.25em;
        width: 100%;
      }
    }
  }
`
