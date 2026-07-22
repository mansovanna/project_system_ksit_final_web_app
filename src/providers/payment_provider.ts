/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api'

class PaymentProvider {
  getBanks(search: string = '', per_page: number = 10, page: number = 1) {
    return api.get('/admin/bank', {
      params: {
        search: search,
        per_page: per_page,
        page: page,
      },
    })
  }
  createBank(data: any) {
    return api.post('/admin/bank', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
  updateBank(id: number, data: FormData) {
    return api.post(`/admin/bank/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        _method: 'PUT',
      },
    })
  }
  deletebanks(id: string) {
    return api.delete(`/admin/bank/${id}`)
  }
  //
  getQrCodeBanks() {
    return api.get('/bank_qrs')
  }

  //
  getQrOne(is_currency: string) {
    return api.get('/bank_qr', {
      params: {
        is_currency: is_currency,
      },
    })
  }

  // -----------------------------------------------
  checkout(data: any) {
    return api.post('/admin/payment/checkout', data)
  }
  transaction(data: any) {
    return api.post('/admin/payment/verify-transaction', data)
  }

  getUserisNotPayment(search: string, per_page: number, page: number) {
    return api.get('/admin/payment', {
      params: {
        search: search,
        per_page: per_page,
        page: page,
      },
    })
  }

  paymentsUser(formData: FormData) {
    return api.post('/admin/payment/payment-process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // ---------------------------------
  studentPaymentHistory(status: string, per_page: number, page: number) {
    return api.get('/user/payments/history', {
      params: {
        status: status,
        per_page: per_page,
        page: page,
      },
    })
  }

  studentProcessPayment(formData: FormData) {
    return api.post('/user/payments/process', formData)
  }

  // check updata status code
  upateCheck(id: number, status: string) {
    return api.put(`/admin/payment/update-check/${id}`, {
      status: status,
    })
  }

  // ------
  getPaymentByID(id: number) {
    return api.get(`/admin/payment/${id}`)
  }

  getUserPayments({
    user_id,
    search,
    per_page,
    page,
  }: {
    user_id: number
    search: string
    per_page: number
    page: number
  }) {
    return api.get(`/admin/payment/student/${user_id}`, {
      params: {
        search: search,
        per_page: per_page,
        page: page,
      },
    })
  }

  getPaymentByUserId(id: number) {
    return api.get(`/admin/payment/history/${id}`)
  }

  // student payment manual
  studentPaymentManual(formData: FormData) {
    return api.post('/user/payments/manual', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
  studentTransaction(md5: string, amount: string) {
    return api.post('/user/payments/verify-transaction', {
      md5: md5,
      amount: amount,
    })
  }

  studentPaymentDetail(id: number) {
    return api.get(`/user/payments/${id}`)
  }
}

export default new PaymentProvider()
