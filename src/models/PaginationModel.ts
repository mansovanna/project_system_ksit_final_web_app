export interface Pagination<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: PaginationLinks[]
  next_page_url: string | null
  path: string
  prev_page_url: string | null
  to: number
  per_page: number
  total: number
}

export interface PaginationLinks {
  url: string | null
  label: string
  page: number | null
  active: boolean
}
