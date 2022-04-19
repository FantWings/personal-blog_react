import styled from 'styled-components'
import { LoadingOutlined } from '@ant-design/icons'

export default function Loading({ loading = false, children }: { loading: boolean; children?: Element }) {
  return (
    <Body>
      <div className="loadingBlock" style={{ display: loading ? 'block' : 'none' }}>
        <LoadingOutlined />
        <div>请稍等</div>
      </div>
      {children}
    </Body>
  )
}

const Body = styled.div`
  div.loadingBlock {
    margin: 1em;
    text-align: center;
  }
`
