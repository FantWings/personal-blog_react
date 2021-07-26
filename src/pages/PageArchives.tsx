// 导入标准库
import { useHistory, useParams } from 'react-router'
import styled from 'styled-components'
import Markdown from 'react-markdown'
import copyLink from 'copy-to-clipboard'

import { ThemeColor } from '../utils/constent'
// import Widges from '../components/widges'
// import IconButton from '../components/iconButton'
import { useState } from 'react'
import { useEffect } from 'react'
import { fetchData } from '../utils/fetch'
import { blogDetailRespond } from '../utils/interfaces'
import { BASEURL } from '../config'

import { LoadingOutlined, QrcodeOutlined, LinkOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Tooltip, Divider, message } from 'antd'

export default function PageArchives() {
  const history = useHistory()
  // 从URL获取文档ID
  const { archId } = useParams<{ archId: string }>()
  const [data, setData] = useState<blogDetailRespond>({
    title: 'LOL',
    text: '# This is a header\n\nAnd this is a paragraph',
    date: '2021年7月26日10:34:43',
    view: 100,
    comment: null,
    owner: false,
  })
  // const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    fetchData(`${BASEURL}/api/v1/getArchivesDetail/${archId}`).then((data) => {
      data && setData(data)
    })
  }, [archId])

  const HandleSubmitComment = () => {
    setSubmitting(!submitting)
  }

  // 解构赋值文章数据
  const { title, text, date, view } = data

  const user = [
    {
      tooltip: '获取二维码',
      icon: <QrcodeOutlined />,
    },
    {
      tooltip: '复制文章链接',
      icon: <LinkOutlined />,
      onclick: () => {
        copyLink(window.location.href)
        message.success({
          content: '链接已复制到剪贴板',
          key: 'copyed-on-board',
        })
      },
    },
  ]
  const admin = [
    {
      tooltip: '编辑文章',
      icon: <EditOutlined />,
      onclick: () => history.push(`/edit/${archId}`),
    },
    {
      tooltip: '删除文章',
      icon: <DeleteOutlined />,
    },
  ]

  return (
    <>
      <LeftView>
        <BlogDetail>
          <div id="titleBlock">
            <div>
              <span id="title">{title}</span>
              <span id="lastupdate">{date}:30:47</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span id="visited">被浏览</span>
              <span>{view}</span>
            </div>
          </div>
          <div className="body">
            <Markdown>{text}</Markdown>
          </div>

          <Divider />

          <Tools userTools={user} adminTools={admin}></Tools>
        </BlogDetail>
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
      </LeftView>
      {/* <div style={{ flex: '0.3' }}>
        <Widges title="文章管理">
          <BottomGroup>
            <IconButton text="按钮" />
            <IconButton text="按钮" />
            <IconButton text="按钮" />
          </BottomGroup>
        </Widges>
      </div> */}
    </>
  )
}

// 文章末尾的工具按钮，传入工具列表
function Tools({ userTools, adminTools }: { userTools: any; adminTools?: any }) {
  return (
    <div className="tools">
      <ul id="userTools" className="disableDefaultListStyle">
        {userTools.map((obj: any) => {
          return (
            <Tooltip placement="top" title={obj.tooltip} key={obj.tooltip}>
              <li onClick={obj.onclick}>{obj.icon}</li>
            </Tooltip>
          )
        })}
      </ul>
      <ul id="adminTools" className="disableDefaultListStyle">
        {adminTools &&
          adminTools.map((obj: any) => {
            return (
              <Tooltip placement="top" title={obj.tooltip} key={obj.tooltip}>
                <li onClick={obj.onclick}>{obj.icon}</li>
              </Tooltip>
            )
          })}
      </ul>
    </div>
  )
}

const LeftView = styled.div`
  flex: 0.7;
  margin-right: 10px;
<<<<<<< HEAD
`

const BlogDetail = styled.div`
  background-color: #fff;
  margin-bottom: 1em;
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  #titleBlock {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2em;
    #title {
      font-size: 2em;
      display: block;
      font-weight: 600;
    }
    #lastupdate {
      font-size: 0.5em;
      color: ${ThemeColor.gray};
    }
    #visited {
      color: ${ThemeColor.gray};
    }
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
=======
  .archive {
    background-color: #fff;
    margin-bottom: 1em;
    #titleBlock {
      display: flex;
      justify-content: space-between;
      padding: 1.5em;
      align-items: center;
      #title {
        font-size: 2em;
        display: block;
      }
      #lastupdate {
        font-size: .85em;
        color: ${ThemeColor.gray};
      }
      #visited {
        color: ${ThemeColor.gray};
>>>>>>> d73c26170d5ae4fd796dcf0ca7697c7b150c111d
      }
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
