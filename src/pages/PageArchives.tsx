// 导入标准库
import { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'
import Markdown from 'react-markdown'
import copyLink from 'copy-to-clipboard'
import gfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import QRCode from 'qrcode.react'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import {
  LoadingOutlined,
  QrcodeOutlined,
  LinkOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import { Tooltip, Divider, message, Popconfirm, Avatar } from 'antd'

import { ThemeColor } from '../utils/constent'
import fetchData from '../utils/fetch'
import { archiveInterface, commentsInterface } from '../utils/interfaces'
import { BASEURL } from '../config'
import { AuthContext } from '../context/authContextProvider'

export default function PageArchives() {
  // 从URL获取文档ID
  const { archId } = useParams<{ archId: string }>()
  const [data, setData] = useState<archiveInterface>({
    title: '',
    createTime: 0,
    updateTime: 0,
    views: 0,
    author: '',
    content: '',
    coverImage: '',
    author_uuid: '',
    tags: [],
  })

  useEffect(() => {
    fetchData(`${BASEURL}/v1/archive/getDetail/${archId}`, 'GET').then((data: archiveInterface) => {
      setData(data)
    })
  }, [archId])

  // 解构赋值文章数据
  const { title, createTime, views, content, author_uuid } = data
  return (
    <>
      <LeftView>
        <BlogDetail>
          <div id="head">
            <div id="titleBlock">
              <span id="post_title" className="textHidden-singleLine-if-overflow">
                {title}
              </span>
              <span id="lastupdate">{new Date(createTime).toLocaleString()}</span>
            </div>
            <div id="visitBlock">
              <span id="visited">被浏览</span>
              <span>{views}</span>
            </div>
          </div>
          <Divider dashed />
          <div className="body">
            <Markdown children={content} remarkPlugins={[gfm]} components={markdownComponents} />
          </div>
          <Divider />
          <ArchiveTools archId={archId} author_uuid={author_uuid} />
        </BlogDetail>
        <ArchiveComment archId={archId} />
      </LeftView>
    </>
  )
}

// 工具栏组件
function ArchiveTools({ archId, author_uuid }: { archId: string | undefined; author_uuid: string | undefined }) {
  // 博客工具栏
  const navigate = useNavigate()
  const {
    userInfo: { uuid },
  } = useContext(AuthContext)

  // 拷贝链接到剪贴板
  const copyArchiveLink = () => {
    copyLink(window.location.href)
    message.success({
      content: '链接已复制到剪贴板',
      key: 'copyed-on-board',
    })
  }

  const HandleArchiveDelete = () => {
    fetchData(`${BASEURL}/v1/archive/delete?archId=${archId}`, 'POST', {
      token: localStorage.getItem('token'),
    }).then(
      () => {
        message.success('操作成功')
        navigate('/')
      },
      ({ status }) => {
        if (status === 10) navigate('/login')
      }
    )
  }

  return (
    <div className="tools">
      <ul id="userTools" className="disableDefaultListStyle">
        <li>
          <div className="archiveQRCode">
            <div className="QRContent">
              <QRCode value={window.location.href} size={100} />
            </div>
            <QrcodeOutlined />
          </div>
        </li>
        <Tooltip placement="top" title="复制文章链接">
          <li onClick={copyArchiveLink}>
            <LinkOutlined />
          </li>
        </Tooltip>
      </ul>
      {author_uuid === uuid && (
        <ul id="AdminTools" className="disableDefaultListStyle">
          <Tooltip placement="top" title="编辑文章">
            <li onClick={() => navigate(`/edit?archId=${archId}&edit=true`)}>
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
function ArchiveComment({ archId }: { archId: string | undefined }) {
  const [submitting, setSubmitting] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Array<commentsInterface>>([])
  const {
    loggedIn,
    userInfo: { is_admin, uuid },
  } = useContext(AuthContext)

  useEffect(() => {
    fetchData(`${BASEURL}/v1/archive/comment?archId=${archId}`, 'GET').then((data: Array<commentsInterface>) =>
      setComments(data)
    )
  }, [archId])

  const HandleSubmitComment = () => {
    if (!commentText) {
      return message.warn('评论不可为空')
    }

    setSubmitting(true)
    const token = localStorage.getItem('token')
    fetchData(`${BASEURL}/v1/archive/comment?archId=${archId}`, 'POST', { token }, { comment: commentText })
      .then(() => {
        return fetchData(`${BASEURL}/v1/archive/comment?archId=${archId}`, 'GET')
      })
      .then((data: Array<commentsInterface>) => {
        setComments(data)
        message.success('评论已成功提交')
        setCommentText('')
      })
      .finally(() => setSubmitting(false))
      .catch((err) => console.log(err))
  }

  const handleDeleteComment = (comment_id: number) => {
    const token = localStorage.getItem('token')
    fetchData(`${BASEURL}/v1/archive/comment?comment_id=${comment_id}`, 'DELETE', { token })
      .then(() => {
        message.success('操作成功')
        return fetchData(`${BASEURL}/v1/archive/comment?archId=${archId}`, 'GET')
      })
      .then((data: Array<commentsInterface>) => setComments(data))
      .catch((err) => console.log(err))
  }

  return (
    <Comment>
      <div id="formBlock">
        <span id="title">发表留言</span>
        <form>
          <textarea
            name="comment"
            id="commentInputArea"
            placeholder={!loggedIn ? '您需要登录才可进行留言噢！' : '有疑问或者错误的地方？在此输入您的留言吧！'}
            onChange={(e) => setCommentText(e.target.value)}
            value={commentText}
            disabled={!loggedIn}
          />
        </form>
        <div>
          <button
            onClick={() => HandleSubmitComment()}
            className={submitting || !loggedIn ? 'disabled' : undefined}
            disabled={!loggedIn}
          >
            {submitting && <LoadingOutlined style={{ marginRight: '0.5em' }} />}
            {submitting ? '发送中' : '提交留言'}
          </button>
        </div>
      </div>
      <div id="commentsBlock">
        <Divider>留言板</Divider>
        {comments.length === 0 && <span id="noneComments">还没有留言</span>}
        {comments.map((value) => {
          const { id, avatar, comment, nickname, time, owner } = value
          return (
            <div className="commentItems" key={id}>
              <div className="commentUserInfo">
                <div className="userAvatar">
                  <Avatar src={avatar} size={48} />
                </div>
                <div>
                  <span className="userNickName">{nickname}</span>
                  <span className="commentTime">{new Date(time).toLocaleString()}</span>
                </div>
              </div>
              <div className="commentContent">
                <div className="commentText">
                  <span>{comment}</span>
                </div>
                {loggedIn && (
                  <div className="comment_control">
                    <span className="textBtn">回复</span>
                    {(is_admin === 1 || uuid === owner) && (
                      <span className="textBtn" onClick={() => handleDeleteComment(id)}>
                        删除
                      </span>
                    )}
                  </div>
                )}
              </div>
              <Divider dashed />
            </div>
          )
        })}
      </div>
    </Comment>
  )
}

const markdownComponents = {
  // 高亮语法控制
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <>
        <div className="tool-bar">
          <div className="item">
            <span className="control" />
          </div>
          <div className="item">
            <span className="title">
              {match[1]} - {node.data ? `${node.data.meta}` : 'fragments'}
            </span>
          </div>
          <div className="item">
            <span className="copyBtn" onClick={() => message.success('代码已复制到剪贴板，转载请务必注明来源！')}>
              <CopyOutlined />
            </span>
          </div>
        </div>
        <SyntaxHighlighter
          style={atomOneDark}
          customStyle={{ padding: '1em', FontFace: 'JetBrains' }}
          language={match[1]}
          PreTag="div"
          showLineNumbers={true}
          wrapLongLines={true}
          children={String(children).replace(/\n$/, '')}
          {...props}
        />
      </>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}

const LeftView = styled.div`
  flex: 1;
  max-width: 95%;
  margin: 0 auto;
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
    div#titleBlock {
      display: flex;
      flex-direction: column;
      @media all and (max-width: 768px) {
        width: 0;
        flex: 0.8;
      }
      span#post_title {
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

    img {
      width: 100%;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      padding-left: 0.5em;
      border-left: #918ee5 3px solid;
      font-weight: bold;
      margin: 1em 0;
    }
    blockquote {
      background-color: #f8f8f8;
      padding: 13px;
      border-left: #4d4d4d 10px solid;
      box-sizing: border-box;
    }

    p {
      code {
        margin: 0 5px;
        padding: 2px 5px;
        font-size: 0.9em;
        background: #f2f4f5;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
      }
    }

    pre {
      border-radius: 8px;
      background-color: #282c34;
      padding-top: 30px;
      box-shadow: 0 0 25px 0px #7f7f7f;
      position: relative;
      margin: 25px 0;
      :hover {
        div.tool-bar span.copyBtn {
          font-size: 1em;
        }
      }
      div.tool-bar {
        display: flex;
        position: absolute;
        width: 100%;
        top: 0;
        color: #a9a9a9;
        justify-content: space-between;
        align-items: center;
        height: 30px;
        padding: 0 10px;
        z-index: 10;

        span.control {
          ::before {
            content: '';
            background: #fc625d;
            width: 11px;
            height: 11px;
            left: 10px;
            top: 10px;
            position: absolute;
            box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
            border-radius: 50%;
          }
        }

        span.copyBtn {
          font-size: 0;
          transition: all 0.3s;
          :hover {
            cursor: pointer;
            color: #fff;
          }
        }
      }
      code {
        font-family: JetBrains, source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
        line-height: 25px;
        :hover {
          background-color: #2c313e;
        }
        span.linenumber {
          color: #474d5c;
        }
      }
    }
  }

  div.tools {
    display: flex;
    justify-content: space-between;
    position: relative;
    li {
      font-size: 1.5em;
      margin: 0 0.5em;
      :hover {
        color: ${ThemeColor.red};
        cursor: pointer;
      }
    }
    div.archiveQRCode {
      div.QRContent {
        opacity: 0;
        position: absolute;
        bottom: 50px;
        padding: 1em;
        background-color: #fff;
        box-shadow: 0px 0px 16px 4px #6b6b6b2e;
        border-radius: 6px;
        transition: all 0.3s ease-in-out 0.3s;
        canvas {
          display: block;
        }
      }
      :hover div.QRContent {
        bottom: 40px;
        opacity: 1;
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
  background-color: #fff;
  padding: 1.5em;
  div#formBlock {
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
      button.disabled {
        background-color: #2b2d426e;
        pointer-events: none;
      }
    }
  }
  div#commentsBlock {
    margin: 1em 0;

    #noneComments {
      text-align: center;
      display: block;
      font-size: 1.5em;
      margin: 2em 0;
      color: #e2e2e2;
    }

    div.commentItems {
      /* display: flex; */
      padding: 1em;
      /* flex-wrap: wrap; */

      div.commentUserInfo {
        display: flex;
        div.userAvatar {
          margin-right: 1em;
        }
        div {
          span.userNickName {
            display: block;
            font-weight: 600;
            font-size: 1.2em;
          }
          span.commentTime {
            color: #acacac;
          }
        }
      }

      div.commentContent {
        display: flex;
        flex-direction: column;
        padding: 1em;

        div.commentText {
          flex: 1 100%;
          padding: 1em 0 1.25em 0;
        }

        div.comment_control {
          color: gray;
        }
      }
    }
  }
`
