import { useParams } from 'react-router'
import MdEditor from 'react-markdown-editor-lite'
import Markdown from 'react-markdown'
import gfm from 'remark-gfm'

import 'react-markdown-editor-lite/lib/index.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { fetchData } from '../utils/fetch'
import { BASEURL } from '../config'
import { ThemeColor } from '../utils/constent'
import styled from 'styled-components'

export default function PageEditer() {
  const { archId } = useParams<{ archId: string }>()
  const [text, setText] = useState('')
  const [title, setTitle] = useState('<undefined>')

  useEffect(() => {
    fetchData(`${BASEURL}/api/v1/getArchivesDetail/${archId}`).then((data) => {
      data && setText(data.text)
      data && setTitle(data.title)
    })
  }, [archId])

  const HandleSubmit = () => {
    console.log(text)
  }

  return (
    <div style={{ width: '100%' }}>
      <EditContainer>
        <div id="titleGroup">
          <span id="title">您正在编辑文章 {title}</span>
          <button onClick={HandleSubmit}>提交</button>
        </div>
        <MdEditor
          value={text}
          renderHTML={(text: string) => {
            return <Markdown children={text} remarkPlugins={[gfm]} />
          }}
          onChange={(e) => setText(e.text)}
          style={{ height: '600px' }}
        />
      </EditContainer>
    </div>
  )
}

const EditContainer = styled.div`
  flex: 1;
  div#titleGroup {
    display: flex;
    margin-bottom: 1.5em;
    justify-content: space-between;
    #title {
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
`
