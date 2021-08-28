// 导入标准库
import { useHistory, useParams } from 'react-router'
import styled from 'styled-components'
import Markdown from 'react-markdown'
import copyLink from 'copy-to-clipboard'
import gfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { ThemeColor } from '../utils/constent'
// import Widges from '../components/widges'
// import IconButton from '../components/iconButton'
import { useState } from 'react'
import { useEffect } from 'react'
import fetchData from '../utils/fetch'
import { blogDetailRespond } from '../utils/interfaces'
import { BASEURL } from '../config'

import { LoadingOutlined, QrcodeOutlined, LinkOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Tooltip, Divider, message, Popconfirm } from 'antd'

export default function PageArchives() {
  // 从URL获取文档ID
  const { archId } = useParams<{ archId: string }>()
  const [data, setData] = useState<blogDetailRespond>({
    title: '',
    createTime: 0,
    updateTime: 0,
    views: 0,
    author: undefined,
    content: '',
    coverImage: undefined,
  })
  // const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData(`${BASEURL}/api/v1/archive/getDetail/${archId}`, 'GET').then((data: blogDetailRespond) => {
      setData(data)
    })
  }, [archId])

  // 解构赋值文章数据
  const { title, createTime, views, content, author } = data
  return (
    <>
      <LeftView>
        <BlogDetail>
          <div id="head">
            <div id="titleBlock">
              <span id="title" className="textHidden-singleLine-if-overflow">
                {title}
              </span>
              <span id="lastupdate">{new Date(createTime).toLocaleString()}</span>
            </div>
            <div id="visitBlock">
              <span id="visited">被浏览</span>
              <span>{views}</span>
            </div>
          </div>
          <div className="body">
            <Markdown children={content} remarkPlugins={[gfm]} components={markdownComponents} />
          </div>
          <Divider />
          <ArchiveTools archId={archId} author={author} />
        </BlogDetail>
        <ArchiveComment archId={archId} />
      </LeftView>
    </>
  )
}

// 工具栏组件
function ArchiveTools({ archId, author }: { archId: string; author: string | undefined }) {
  // 博客工具栏
  const history = useHistory()

  // 拷贝链接到剪贴板
  const copyArchiveLink = () => {
    copyLink(window.location.href)
    message.success({
      content: '链接已复制到剪贴板',
      key: 'copyed-on-board',
    })
  }

  const HandleArchiveDelete = () => {
    fetchData(`${BASEURL}/api/v1/archive/delete?archId=${archId}`, 'POST', {
      token: localStorage.getItem('token'),
    }).then(
      () => {
        message.success('操作成功')
        history.push('/')
      },
      ({ status }) => {
        if (status === 10) history.push('/login')
      }
    )
  }

  return (
    <div className="tools">
      <ul id="userTools" className="disableDefaultListStyle">
        <Tooltip placement="top" title="获取二维码">
          <li>
            <QrcodeOutlined />
          </li>
        </Tooltip>
        <Tooltip placement="top" title="复制文章链接">
          <li onClick={copyArchiveLink}>
            <LinkOutlined />
          </li>
        </Tooltip>
      </ul>
      {author === localStorage.getItem('username') && (
        <ul id="AdminTools" className="disableDefaultListStyle">
          <Tooltip placement="top" title="编辑文章">
            <li onClick={() => history.push('/edit', { edit: true, archId })}>
              <EditOutlined />
            </li>
          </Tooltip>
          <Tooltip placement="top" title="删除文章">
            <Popconfirm
              placement="top"
              okText="确认"
              okType="danger"
              cancelText="取消"
              title="此操作将会删除这条文章"
              onConfirm={HandleArchiveDelete}
            >
              <li>
                <DeleteOutlined />
              </li>
            </Popconfirm>
          </Tooltip>
        </ul>
      )}
    </div>
  )
}

// 评论功能组件
function ArchiveComment({ archId }: { archId: string }) {
  const [submitting, setSubmitting] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])

  useEffect(() => {
    fetchData(`${BASEURL}/api/v1/archive/comment?archId=${archId}`, 'GET').then((data) => setComments(data))
  }, [])

  const HandleSubmitComment = () => {
    setSubmitting(true)
    const token = localStorage.getItem('token')
    fetchData(
      `${BASEURL}/api/v1/archive/comment?archId=${archId}`,
      'POST',
      { token },
      { comment: commentText }
    ).finally(() => setSubmitting(false))
  }

  return (
    <Comment>
      <div>
        <span id="title">发表评论</span>
        <form>
          <textarea
            name="comment"
            id="commentInputArea"
            placeholder="有疑问或者错误的地方？在此输入您的留言吧！"
            onChange={(e) => setCommentText(e.target.value)}
            value={commentText}
          />
        </form>
        <div>
          <button
            onClick={() => HandleSubmitComment()}
            style={{
              pointerEvents: submitting ? 'none' : 'unset',
              backgroundColor: submitting ? '#2b2d426e' : '#2b2d42',
            }}
          >
            {submitting && <LoadingOutlined style={{ marginRight: '0.5em' }} />}
            {submitting ? '发送中' : '提交留言'}
          </button>
        </div>
      </div>
    </Comment>
  )
}

const markdownComponents = {
  // 高亮语法控制
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <SyntaxHighlighter
        style={atomOneDark}
        language={match[1]}
        PreTag="div"
        showLineNumbers={true}
        wrapLongLines={true}
        children={String(children).replace(/\n$/, '')}
        {...props}
      />
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}

const LeftView = styled.div`
  flex: 1;
  width: 0;
`

const BlogDetail = styled.div`
  background-color: #fff;
  margin-bottom: 1em;
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  #head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2em;
    div#titleBlock {
      display: flex;
      flex-direction: column;
      @media all and (max-width: 768px) {
        width: 0;
        flex: 0.8;
      }
      span#title {
        font-size: 1.6em;
        font-weight: 600;
      }
    }
    div#visitBlock {
      display: flex;
      flex-direction: column;
      align-items: center;
      @media all and (max-width: 768px) {
        flex: 0.2;
      }
    }

    #lastupdate,
    #visited {
      color: ${ThemeColor.gray};
    }
  }

  div.body {
    display: flex;
    flex-direction: column;
  }

  div.tools {
    display: flex;
    justify-content: space-between;
    li {
      font-size: 1.5em;
      margin: 0 0.5em;
      :hover {
        color: ${ThemeColor.red};
        cursor: pointer;
      }
    }
  }
  table {
    font-size: 14px;
    line-height: 1.7;
    max-width: 100%;
    overflow: auto;
    border: 1px solid #f6f6f6;
    border-collapse: collapse;
    border-spacing: 0;
    box-sizing: border-box;
    td {
      border: 1px solid #efefef;
      text-align: left;
      padding: 10px 15px;
      word-break: break-word;
      min-width: 60px;
    }
    th {
      text-align: center;
      font-weight: 700;
      border: 1px solid #efefef;
      padding: 10px 6px;
      background-color: #f5f7fa;
      word-break: break-word;
    }
  }
`

const Comment = styled.div`
  div {
    background-color: #fff;
    height: 100%;
    padding: 1.5em;

    #title {
      display: block;
      font-size: 1.25em;
      font-weight: 600;
    }

    form {
      background-color: #f8f8f8;
      border-radius: 0.25em;
      margin: 1em 0;
      padding: 1em;

      textarea {
        border: none;
        width: 100%;
        box-sizing: border-box;
        background-color: transparent;
        resize: none;
        color: #333;
        outline: none;
        min-height: 6em;
      }
    }
    div {
      display: flex;
      justify-content: flex-end;
      padding: 1em;

      button {
        border: none;
        background: ${ThemeColor.dark};
        color: ${ThemeColor.white};
        padding: 0.3em 0.6em;
        border-radius: 0.2em;
        transition: 0.3s;
        :hover {
          cursor: pointer;
          background-color: #545880;
        }
        :active {
          background-color: #000;
        }
      }
    }
  }
`
