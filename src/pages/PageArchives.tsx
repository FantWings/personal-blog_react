// 导入标准库
import { useParams } from 'react-router'
import styled from 'styled-components'

import { ThemeColor } from '../utils/constent'
import Widges from '../components/widges'
import IconButton from '../components/iconButton'

export default function PageArchives() {
  // 从URL获取文档ID
  const { archId } = useParams<{ archId: string }>()
  return (
    <PageContainer>
      <LeftViewComponent>
        <div className="archive">
          <div id="titleBlock">
            <div>
              <span id="title">这是标题</span>
              <span id="lastupdate">2021年7月24日10:30:47</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span id="visited">被浏览</span>
              <span>0</span>
            </div>
          </div>
        </div>
        <div className="comment">
          <h3>评论</h3>
        </div>
      </LeftViewComponent>
      <div style={{ flex: '0.3' }}>
        <Widges title="文章管理">
          <BottomGroup>
            <IconButton text="按钮" />
            <IconButton text="按钮" />
            <IconButton text="按钮" />
          </BottomGroup>
        </Widges>
      </div>
    </PageContainer>
  )
}

const PageContainer = styled.div`
  display: flex;
  padding: 25px;
  height: calc(100% - 64px);
  box-sizing: border-box;
  max-width: 1200px;
  margin: 0 auto;
`

const LeftViewComponent = styled.div`
  flex: 0.7;
  margin-right: 10px;
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
        font-size: 0.5em;
        color: ${ThemeColor.gray};
      }
      #visited {
        color: ${ThemeColor.gray};
      }
    }
  }
`

const BottomGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
`
