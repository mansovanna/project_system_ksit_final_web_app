import type { Pagination } from './PaginationModel'

interface File {
  id: number
  file_path: string
  file_name: string
  file_type: string
  type: string
  file_size: number
  is_primary: number
  file_url: string
  file_size_formatted: string
  created_at: string
  updated_at: string
}
export interface AnnounncementModel {
  id: number
  title: string
  description: string
  status: 'private' | 'public'
  created_at: string
  updated_at: string
  files: File[]
}

export interface AnnoucentResponseApi {
  message: string
  data: Pagination<AnnounncementModel>
}

export interface AnnouncementResponeModel {
  message: string
  data: AnnounncementModel
}
