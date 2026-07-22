import type { Pagination } from './PaginationModel'

export interface User {
  id: number
  user_name: string
  first_name: string | null
  last_name: string | null
  email: string
  phone_number: string | null
  role: 'admin' | 'staff' | 'user'
  status: 'pending' | 'active' | 'block'
  bio: string | null
  profile_photo_path: string | null
  gender: string | null
  info: info | null
  created_at: string
  updated_at: string
  profile_photo_url: string
}

interface info {
  id: number
  id_card: string
  phone_parent: string
  date_of_birth: string
  major: string
  level: string
  year: string
  address: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  message: string
  type: string
  access_token: string
  token_type: 'Bearer'
  data: User
}

export interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
}

export interface UsersResponseApi {
  message: string
  data: Pagination<User>
}

export interface UserModelReponce {
  message: string
  data: User[]
}
