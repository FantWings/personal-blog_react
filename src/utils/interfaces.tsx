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
  title: string
  text: string
  date: string
  view: number
  comment: null | object
  owner: boolean
}
