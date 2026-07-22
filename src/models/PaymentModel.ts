import type { Pagination } from './PaginationModel'
import type { User } from './UserModel'

export interface PaymentData {
  amount: number
  id_card: string
  username: string
  qr_string: string
  qr_code: string
  is_currency: string
  md5: string
  deeplink: string | null
}

export interface CheckoutResponse {
  message: string
  data: PaymentData
}

// ----------------------\
export interface PaymentsModels {
  id: number
  user_id: number
  is_currency: string
  amount: number
  method: string
  due_date: string
  status: string
  proof_image: string
  approved_by: string
  approved_at: string
  created_at: string
  updated_at: string
  user: User
  image_url: string
}

export interface PaymentResponseAPIs {
  message: string
  data: Pagination<PaymentsModels>
}

export interface PaymentProcessResponse {
  message: string
  data: {
    amount: number
    is_currency: number
    bakong_name: string
    id_card: string
    qr_string: string
    md5: string
    deeplink: string | null
  }
}

export interface BankModel {
  id: number
  bank_name: string
  owner_name: string
  user_name: string
  account_usd: string
  account_khr: string
  color_theme: string | null
  is_active: boolean
  qr_image: string | null
  qr_image_url: string | null
  created_at?: string
  updated_at?: string
}

export interface BankResponseAPI {
  message: string
  data: Pagination<BankModel>
}

export interface BankResponseAPIs {
  message: string
  data: BankModel[]
}

export interface PaymentDetailResponse {
  message: string
  data: PaymentsModels
}

export interface PaymentReportResponse {
  message: string
  period: { from: string; to: string }
  total_active_users: number
  total_paid_payments: number
  total_pending: number
  total_unpaid: number
  paid_list: User[]
  pending_list: User[]
  unpaid_list: User[]
}
