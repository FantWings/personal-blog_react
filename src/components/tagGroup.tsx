import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { ThemeColor } from '../utils/constent'

export default function TagGroup(props: { tags: Array<string>; style?: object }) {
  // TAG组件
  const { tags, style } = props

  // 初始化History，当鼠标点击TAG时，将使用history.push把filter参数推送到URL上
  // 触发父组件刷新并获取筛选数据
  const history = useHistory()

  return (
    <ul className="tags disableDefaultListStyle">
      {tags.map((tags) => {
        return (
          <Tags
            key={tags}
            onClick={() => {
              history.push(`?filter_by=${tags}`)
            }}
            style={style}
          >
            {tags}
          </Tags>
        )
      })}
    </ul>
  )
}

const Tags = styled.li`
  cursor: pointer;
  margin: 0 0.3em;
  padding: 3px 8px;
  background-color: ${ThemeColor.white};
  border-radius: 2px;
  transition: all 0.3s;
  color: ${ThemeColor.gray};
  :hover {
    background-color: ${ThemeColor.dark};
    color: ${ThemeColor.white};
  }
`
