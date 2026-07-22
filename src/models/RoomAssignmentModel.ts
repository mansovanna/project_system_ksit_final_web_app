import type { Pagination } from './PaginationModel'
import type { Room } from './RoomModel'
import type { User } from './UserModel'

interface RoomAssignmentModel {
  id: number
  user_id: number
  room_id: number
  start_date: string // ISO date string
  end_date: string // ISO date string
  status: string
  created_at: string
  updated_at: string
  room: Room
  user: User
}

export interface RoomAssignmentResponse {
  message: string
  data: Pagination<RoomAssignmentModel>
}
