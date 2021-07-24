import styled from 'styled-components'

// 博客右侧组件外壳函数
export default function Widges(props: { title: string; children: object }) {
  const { title } = props
  console.log(props)
  return (
    <PageWidgesContainer>
      <WidgesTitle>
        <span>{title}</span>
      </WidgesTitle>
      {props.children}
    </PageWidgesContainer>
  )
}

const PageWidgesContainer = styled.div`
  background-color: #fff;
  padding: 1em;
  margin-bottom: 10px;
`

const WidgesTitle = styled.div`
  margin-bottom: 0.75em;
  font-weight: 600;
`
