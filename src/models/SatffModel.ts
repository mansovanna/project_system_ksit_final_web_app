import type { Pagination } from './PaginationModel'

export interface StaffModel {
  id: number
  first_name: string | null
  last_name: string | null
  user_name: string
  email: string
  phone_number: string | null
  role: 'admin' | 'staff'
  status: 'pending' | 'active' | 'complete' | 'blocked'
  bio: string | null
  profile_photo_path: string
  profile_photo_url: string
  created_at: string
  updated_at: string
}

export interface StaffModelV2 {
  id: number
  first_name: string | null
  last_name: string | null
  user_name: string
  email: string
  phone_number: string
  role: 'admin' | 'staff'
  status: 'pending' | 'active' | 'complete' | 'blocked'
  bio: string | null
  profile_photo_path: string
  profile_photo_url: string
  created_at: string
  updated_at: string
}

// Pagination links interface
export interface PaginationLink {
  url: string | null
  label: string
  page: number | null
  active: boolean
}

// Paginated response interface
export interface StaffResponse {
  message: string
  data: {
    current_page: number
    data: StaffModel[]
    first_page_url: string
    from: number | null
    last_page: number
    last_page_url: string
    links: PaginationLink[]
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number | null
    total: number
  }
}

export interface StaffProfileResponse {
  message: string
  data: Pagination<StaffModelV2>
}
