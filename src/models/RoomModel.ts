import type { Building } from './BuildModel'

export interface Room {
  id: number
  room_number: string
  floor: number
  max_member: number
  building_id: number
  building: Building
  current_members: number
}
