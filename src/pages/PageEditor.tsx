import { useParams } from 'react-router'
import MdEditor from 'react-markdown-editor-lite'
import Markdown from 'react-markdown'

import 'react-markdown-editor-lite/lib/index.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { fetchData } from '../utils/fetch'
import { BASEURL } from '../config'
import styled from 'styled-components'

export default function PageEditer() {
  const { archId } = useParams<{ archId: string }>()
  const [text, setText] = useState('')
  const [title, setTitle] = useState('')

  useEffect(() => {
    fetchData(`${BASEURL}/api/v1/getArchivesDetail/${archId}`).then((data) => {
      data && setText(data.text)
      setTitle(data.title)
    })
  }, [])

  return (
    <EditContainer style={{ flex: 1 }}>
      <span id="title">您正在编辑文章 {title}</span>
      <MdEditor
        value={text}
        renderHTML={(text) => {
          return <Markdown>{text}</Markdown>
        }}
        onChange={(e) => setText(e.text)}
        style={{ height: '600px', flex: '1' }}
      />
    </EditContainer>
  )
}

const EditContainer = styled.div`
  flex: 1;
  #title {
    font-size: 1.5em;
    font-weight: 600;
    margin: 1em 0;
    display: block;
  }
`
