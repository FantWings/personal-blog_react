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
  image: string
  tag: Array<string>
  time_for_read: number
}

export interface blogDetailRespond {
  title: string | undefined
  views: number
  author: string | undefined
  updateTime: number
  createTime: number
  content: string
  coverImage: string | undefined
}

export interface userInfoRespond {
  avatar?: string
  email?: string
  phone?: number
  qq?: number
  username: string
  uuid: string
}
