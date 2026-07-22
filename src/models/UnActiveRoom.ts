import type { Pagination } from './PaginationModel'
import type { User } from './UserModel'

export interface UnAssingRoomResponce {
  message: string
  data: Pagination<User>
}
