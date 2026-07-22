import type { Pagination } from './PaginationModel'

interface PolicyParams {
  id: number
  title: string
  description: string
  file_path: string
  status: string
  file_type: string
  file_url: string
  created_at: string
  updated_at: string
}

export interface PolicyListResponse {
  message: string
  data: Pagination<PolicyParams>
}

export interface PolicyResponse {
  message: string
  data: PolicyParams
}
