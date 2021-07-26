export interface archivePreviewRespond {
  id: number
  title: string
  preview: string
  lastupdate: string
  view: number
  comment: number
  image: string
  tag: Array<string>
  timeForRead: number
}

export interface blogDetailRespond {
  title: string
  text: string
  date: string
  view: number
  comment: null | object
  owner: boolean
}
