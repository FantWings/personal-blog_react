import styled from 'styled-components'
import { LoadingOutlined } from '@ant-design/icons'

export default function Loading(props: any) {
  return (
    <Body>
      <>
        {props.loading && (
          <div className="loadingBlock">
            <LoadingOutlined />
            <div>请稍等</div>
          </div>
        )}
      </>
      <>{props.children}</>
    </Body>
  )
}

const Body = styled.div`
  div.loadingBlock {
    margin: 1em;
    text-align: center;
  }
`
