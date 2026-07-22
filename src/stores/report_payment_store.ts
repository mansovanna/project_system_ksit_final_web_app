import type { PaymentReportResponse } from '@/models/PaymentModel'
import report_student_provider from '@/providers/report_student_provider'
import { defineStore } from 'pinia'

export const useReportPayment = defineStore('pay-store', {
  state: () => ({
    data: null as PaymentReportResponse | null,
    search: '',
    start_date: '',
    end_date: '',
    status: 'all',
    per_page: 15,
    page: 1,
    isLoading: false,
  }),
  actions: {
    async getPayments(search: string, start_date: string, end_date: string) {
      this.isLoading = true
      try {
        //
        const res = await report_student_provider.getPayments(search, start_date, end_date)

        if (res.status === 200 || res.status === 201) {
          this.data = res.data

          // console.log(this.data)
        }
      } catch (error) {
        //
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
