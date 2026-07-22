/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  PaymentResponseAPIs,
  PaymentDetailResponse,
  PaymentProcessResponse,
} from '@/models/PaymentModel'
import payment_provider from '@/providers/payment_provider'
import { defineStore } from 'pinia'

export const useStudentPaymentStore = defineStore('studentPayment', {
  state: () => ({
    data: null as PaymentResponseAPIs | null,
    processResponse: null as PaymentProcessResponse | null,
    data_detail: null as PaymentDetailResponse | null,
    isLoadingStudentPayment: false,
    activeTab: 'all',
    status: 'all',
    search: '',
    per_page: 10,
    page: 1,
    isLoading: false,
    // -----------------------------------------------
    isMessage: {
      amount: '',
      file: '',
      is_currency: '',
    },
    isMessagePaymentManual: {
      message: '',
      status: 'error',
    },
    formData: {
      amount: '',
      is_currency: 'khr',
      file: null as File | null,
    },
    timeLeft: 120,
    countDown: 120,
    timer: null as ReturnType<typeof setInterval> | null,
    pollingTimer: null as ReturnType<typeof setInterval> | null,
  }),

  actions: {
    async getHistoryPayment(status: string, per_page: number, page: number) {
      this.isLoadingStudentPayment = true

      try {
        const res = await payment_provider.studentPaymentHistory(status, per_page, page)
        if (res.status === 200) {
          this.data = res.data
          console.log('Payment history data:', this.data)
        }
      } catch (error: any) {
        console.log('Error fetching student payment data:', error)
      } finally {
        this.isLoadingStudentPayment = false
      }
    },

    // ---------------------------------
    async processPayment(formData: FormData) {
      this.isLoading = true
      this.isMessage.amount = ''
      this.timeLeft = this.countDown

      const res = await payment_provider.studentProcessPayment(formData)

      if (res.status === 200) {
        // this.isMessage.amount = res.data.message
        // console.log('Payment process response:', res.data)
        this.processResponse = res.data
      }
      try {
      } catch (error: any) {
        console.log('Error processing payment:', error)
      } finally {
        this.isLoading = false
      }
    },

    async paymentManual(formData: FormData) {
      this.isLoading = true
      this.isMessage.amount = ''
      this.isMessage.file = ''
      this.isMessage.is_currency = ''

      try {
        const res = await payment_provider.studentPaymentManual(formData)

        if (res.status === 200 || res.status === 201) {
          if (this.data?.data.data) {
            this.isMessagePaymentManual.message = res.data.message
            this.isMessagePaymentManual.status = 'success'
            this.formData.amount = ''
            this.formData.file = null
            this.formData.is_currency = 'khr'
            this.clearPaymentMessage()
            this.data.data.data.unshift(res.data.data)
          }
        }
      } catch (error: any) {
        const response = error.response

        if (response?.status === 422) {
          const errors = response.data.errors
          this.isMessage.amount = errors?.amount?.[0] ?? ''
          this.isMessage.file = errors?.file?.[0] ?? ''
          this.isMessage.is_currency = errors?.is_currency?.[0] ?? ''
        } else {
          this.isMessagePaymentManual.message = response?.data?.message ?? 'មានបញ្ហាកើតឡើង'
          this.isMessagePaymentManual.status = 'error'
          this.clearPaymentMessage()
        }
      } finally {
        this.isLoading = false
      }
    },

    // run real time of count time --------------

    // --------------------------------- polling api
    startPolling() {
      this.stopPolling()
      this.timeLeft = this.countDown

      // countdown ervry second
      this.timer = setInterval(() => {
        this.timeLeft--

        if (this.timeLeft <= 0) {
          clearInterval(this.timer!)
          this.timer = null
          this.stopPolling()
          this.clearData()
        }
      }, 1000)

      // ------------------
      this.pollingTimer = setInterval(async () => {
        if (!this.processResponse?.data.md5) return

        try {
          const res = await payment_provider.studentTransaction(
            String(this.processResponse?.data.md5),
            String(this.processResponse?.data.amount),
          )

          if (res.status === 200) {
            clearInterval(this.pollingTimer!)
            this.pollingTimer = null
            this.data?.data.data.unshift(res.data.data)
            this.isMessagePaymentManual.message = res.data.message
            this.isMessagePaymentManual.status = 'success'
            this.formData.amount = ''
            this.formData.is_currency = 'khr'
            this.formData.file = null

            setTimeout(() => {
              this.clearData()
              this.status = ''
            }, 1500)

            setTimeout(() => {
              this.isMessagePaymentManual.message = ''
              this.isMessagePaymentManual.status = ''
              // this.timeLeft = this.countDown
            }, 10000)
          } else if (res.status === 400) {
            clearInterval(this.pollingTimer!)
            this.pollingTimer = null

            setTimeout(() => {
              this.clearData()
            }, 1500)
          }
        } catch (err) {
          console.error(err)
        }
      }, 3000)
    },

    clearData() {
      this.processResponse = null
      this.timeLeft = 0
      this.timer = null
    },

    clearPaymentMessage(time: number = 5000) {
      setTimeout(() => {
        this.isMessagePaymentManual.message = ''
        this.isMessagePaymentManual.status = ''
      }, time)
    },

    stopPolling() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }

      if (this.pollingTimer) {
        clearInterval(this.pollingTimer)
        this.pollingTimer = null
      }
    },

    async getPaymentDetail(id: number) {
      this.isLoading = true
      try {
        const res = await payment_provider.studentPaymentDetail(id)
        if (res.status === 200) {
          this.data_detail = res.data
          console.log('Payment detail data:', this.data_detail)
        }
      } catch (error: any) {
        console.log('Error fetching student payment detail data:', error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
