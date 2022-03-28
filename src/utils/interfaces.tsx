// 查询文档返回格式
export interface archiveListsInterface {
  id: number
  title: string
  preview: string
  update_time: number
  views: number
  comment: number
  cover_image: string
  tags: Array<string>
  time_for_read: number
}

export interface archiveInterface {
  title: string
  views: number
  author: string
  updateTime: number
  createTime: number
  content: string
  coverImage: string
  author_uuid: string
  tags: Array<string>
}

export interface userDataInterface {
  avatar: string
  email: { addr: string; verifyed: number }
  phone?: number
  qq?: number
  nickname: string
  uuid: string
  is_admin: number
}

export interface commentsInterface {
  id: number
  owner: string
  avatar: string
  comment: string
  email: string
  nickname: string
  time: number
}
