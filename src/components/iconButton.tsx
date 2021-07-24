import styled from 'styled-components'
import { ThemeColor } from '../utils/constent'

export default function IconButton(props: { icon?: any; text: string }) {
  const { icon, text } = props
  return (
    <Shell>
      {icon ? icon : <span className="icon" />}
      <span className="text">{text}</span>
    </Shell>
  )
}

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 33.33%;
  padding: 1em 0;
  cursor: pointer;
  margin: 0.5em 0;
  border-radius: 5px;
  transition: all 0.5s;
  align-items: center;
  justify-content: start;
  :hover {
    background-color: #f5f5f5;
  }
  .icon {
    display: block;
    height: 32px;
    width: 32px;
    background-color: ${ThemeColor.white};
    border-radius: 6px;
  }
  .text {
    margin-top: 6px;
  }
`
