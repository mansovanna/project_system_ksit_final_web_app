interface InxexModel {
  user_news: string
  user_olds: string
  leaves: string
  staffs: string
  payments: string
}

export interface IndexModelResponse {
  message: string
  data: InxexModel
}
