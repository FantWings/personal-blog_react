export interface standerdResponse {
  data: any
  msg: string
  status: number
}

export interface archivePreviewRespond {
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

export interface blogDetailRespond {
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

export interface userInfoRespond {
  avatar: string
  email: { addr: string; verifyed: number }
  phone?: number
  qq?: number
  nickname: string
  uuid: string
  role: number
}

export interface commentsDataRespond {
  id: number
  owner: string
  avatar: string
  comment: string
  email: string
  nickname: string
  time: number
}
