export interface Building {
  id: number
  name: string
  gender: string
  created_at: string
  updated_at: string
  rooms_count: number
}

export interface PaginationLinks {
  url: string | null
  label: string
  page: number | null
  active: boolean
}
export interface BuildingPagination {
  current_page: number
  data: Building[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: PaginationLinks[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface BuildingResponceApi {
  message: string
  data: BuildingPagination
}
