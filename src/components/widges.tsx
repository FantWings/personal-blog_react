import styled from 'styled-components'

// 博客右侧组件外壳函数
export default function Widges({ title, children }: { title: string; children: object }) {
  return (
    <PageWidgesContainer>
      <WidgesTitle>
        <span>{title}</span>
      </WidgesTitle>
      {children}
    </PageWidgesContainer>
  )
}

const PageWidgesContainer = styled.div`
  flex: 1;
  background-color: #fff;
  padding: 1em;
  max-height: 200px;
`

const WidgesTitle = styled.div`
  margin-bottom: 0.75em;
  font-weight: 600;
`
