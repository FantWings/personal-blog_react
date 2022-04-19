import styled from 'styled-components'
import { ThemeColor } from '../utils/constent'

export default function TagGroup({
  tags,
  style,
  handleUpdate,
}: {
  tags: Array<string>
  style?: object
  handleUpdate: Function
}) {
  // TAG组件
  return (
    <ul className="tags disableDefaultListStyle">
      {tags &&
        tags.map((tags) => {
          return (
            <Tags key={tags} onClick={() => handleUpdate(tags)} style={style}>
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
