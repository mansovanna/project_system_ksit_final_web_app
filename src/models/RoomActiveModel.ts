import type { Building } from './BuildModel'
import type { User } from './UserModel'

interface RoomActive {
  id: number
  floor: number
  max_member: number
  building: Building
  room_actives: RoomActivApi[]
}

interface RoomActivApi {
  id: number
  start_date: string
  end_date: string
  status: string
  user: User
}

export interface RoomActiveResponse {
  message: string
  data: RoomActive
}
