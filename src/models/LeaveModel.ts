import type { Pagination } from './PaginationModel'
import type { User } from './UserModel'

interface LeaveModel {
  id: string
  user_id: string
  reason: string
  description: string
  start_date: string
  end_date: string
  approved_by: string
  status: string
  created_at: string
  updated_at: string
  user: User
}

export interface LeaveResponse {
  message: string
  data: Pagination<LeaveModel>
}

export interface LeaveResponseById {
  message: string
  data: LeaveModel
}
