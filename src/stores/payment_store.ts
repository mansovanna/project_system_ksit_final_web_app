/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  BankResponseAPIs,
  BankResponseAPI,
  CheckoutResponse,
  PaymentResponseAPIs,
  PaymentsModels,
} from '@/models/PaymentModel'
import payment_provider from '@/providers/payment_provider'
import PaymentProvider from '@/providers/payment_provider'
import { defineStore } from 'pinia'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    data: null as PaymentResponseAPIs | null,
    paymentAPIResponse: null as CheckoutResponse | null,
    data_bank: null as BankResponseAPI | null,
    data_qr: null as BankResponseAPIs | null,
    data_state: null as PaymentsModels | null,
    paymentType: 'manual',
    formData: {
      id_card: 'ksit-0011223344',
      amount: 0,
      is_currency: 'khr',
      proof_image: File,
    },
    isMessageError: {
      id_card: '',
      amount: '',
      is_currency: '',
      proof_image: '',
      file: null,
    },

    isMessageBank: {
      message: '',
      type: '',
    },
    invoicePreview: '',
    file: null as File | null,
    isLoadingPayment: false,
    isLoading: false,
    isLoadingTransaction: false,
    timeLeft: 120,
    countdown: 120,
    // Note delete
    isShowCreatePayment: false,
    // Note delete
    isShowPaymentManul: false,
    isShowPaymentPayway: false,
    isFormDataUpdate: false,
    isLoadAny: {
      id: '',
      isLoading: false,
    },
    isPoPMessage: false,
    isOpen: false,

    // ---------
    search: '',
    per_page: 10,
    page: 1,
    isMessage: {
      message: '',
      title: '',
    },
  }),

  actions: {
    setPaymentType(type: string) {
      this.paymentType = type
    },
    onInvoiceChange(event: Event) {
      const target = event.target as HTMLInputElement
      const file = target.files ? target.files[0] : null

      if (file) {
        this.invoicePreview = URL.createObjectURL(file)
        this.file = file
      } else {
        this.invoicePreview = ''
      }
    },

    // -----------------------
    async getBanks(search: string = '', per_page: number = 10, page: number = 1) {
      this.isLoadingPayment = true

      try {
        const res = await PaymentProvider.getBanks(search, per_page, page)
        if (res.status == 200 || res.status == 201) {
          console.log(res.data)
          this.data_bank = res.data
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoadingPayment = false
      }
    },

    async createBank(data: any) {
      this.isMessageBank.message = ''
      this.isMessageBank.type = ''
      this.isLoadingPayment = true
      try {
        const res = await PaymentProvider.createBank(data)
        if (res.status == 200 || res.status == 201) {
          // alert('Create Successfully')
          this.isShowCreatePayment = false
          this.data_bank?.data.data.unshift(res.data.data)
        }
      } catch (error: any) {
        console.log(error)
        this.isMessageBank.message = error.response.data.message
        this.isMessageBank.type = 'error'
      } finally {
        this.isLoadingPayment = false
      }
    },

    async updateBank(id: number, data: any) {
      this.isLoading = true
      this.isMessageBank.message = ''
      this.isMessageBank.type = ''

      try {
        const res = await PaymentProvider.updateBank(id, data)

        if (res.status == 200 || res.status == 201) {
          if (this.data_bank?.data) {
            this.data_bank.data.data = this.data_bank.data.data.map((item) => {
              if (item.id === res.data.data.id) {
                return { ...item, ...res.data.data }
              }
              return item
            })
          }
          this.isFormDataUpdate = false
        }
      } catch (error: any) {
        console.log(error)
        this.isMessageBank.message = error.response.data.message
        this.isMessageBank.type = 'error'
      } finally {
        this.isLoading = false
      }
    },
    async deleteBank(id: string) {
      this.isLoadAny.isLoading = true

      try {
        const res = await PaymentProvider.deletebanks(id)

        if (res.status == 200 || res.status == 201) {
          if (this.data_bank?.data) {
            //
            this.data_bank.data.data = this.data_bank.data.data.filter((e) => e.id !== Number(id))
          }

          this.isLoadAny.id = ''
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoadAny.isLoading = false
      }
    },

    // Block Get Qr Code
    async getQRCodeBanks() {
      this.isLoading = true
      try {
        const res = await PaymentProvider.getQrCodeBanks()
        if (res.status == 200 || res.status == 201) {
          this.data_qr = res.data
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    // Note delete
    async getQrOne(is_Currency: string = 'khm') {
      this.isLoading = true

      try {
        const res = await PaymentProvider.getQrOne(is_Currency)

        if (res.status == 200 || res.status == 201) {
          this.data_qr = res.data[0]
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    // End Note delete

    async updateCheckStatus(id: number, status: string) {
      this.isLoadAny.id = String(id)
      this.isLoadAny.isLoading = true

      try {
        const res = await PaymentProvider.upateCheck(id, status)
        if (res.status == 200 || res.status == 201) {
          // alert('this is code update successfully!')
          this.isPoPMessage = true
          // setTimeout(() => {
          //   this.isPoPMessage = false
          // }, 3000)
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoadAny.isLoading = false
      }
    },

    // PayWay ----------------------------------------------------------
    async checkout(data: any) {
      this.isLoadingPayment = true
      this.isMessageError.id_card = ''
      this.isMessageError.amount = ''
      this.isMessageError.is_currency = ''

      try {
        const response = await PaymentProvider.checkout(data)
        if (response.status === 200 || response.status === 201) {
          this.paymentAPIResponse = response.data
          // console.log(response.data)
        }
      } catch (error: any) {
        console.log(error.response)
        this.isMessageError.id_card = error.response.data.errors.id_card[0] ?? ''
        // throw error
      } finally {
        this.isLoadingPayment = false
      }
    },
    async transaction(data: any) {
      this.isLoadingTransaction = true

      try {
        const response = await PaymentProvider.transaction(data)
        return response.data
      } catch (error) {
        console.error('Transaction error:', error)
        throw error
      } finally {
        this.isLoadingTransaction = false
      }
    },
    // -----------------------
    clearData() {
      this.paymentAPIResponse = null
      this.paymentType = 'manual'
      this.formData = {
        id_card: '',
        amount: 0,
        is_currency: 'khr',
        proof_image: File,
      }
      this.isMessageError = {
        id_card: '',
        amount: '',
        is_currency: '',
        proof_image: '',
        file: null,
      }
      this.isShowCreatePayment = false
      this.invoicePreview = ''
      this.timeLeft = 120
      this.countdown = 120
    },

    async getUserNotPayments(search: string, per_page: number, page: number) {
      this.isLoadingPayment = true
      try {
        const res = await PaymentProvider.getUserisNotPayment(search, per_page, page)
        // console.log(res.data)
        this.data = res.data
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoadingPayment = false
      }
    },

    // -------
    async addPaymentUser(data: FormData) {
      this.isLoadingPayment = true

      this.isMessageError = {
        id_card: '',
        amount: '',
        is_currency: '',
        proof_image: '',
        file: null,
      }

      try {
        const res = await payment_provider.paymentsUser(data)
        if (res.status == 200) {
          // console.log(res.statusText)
          this.isShowPaymentManul = false
        }
      } catch (error: any) {
        console.log(error.response)
        this.isMessageError.id_card = error.response.data.errors.id_card[0] ?? ''
        this.isMessageError.amount = error.response.data.errors.amount[0] ?? ''
        this.isMessageError.is_currency = error.response.data.errors.is_currency[0] ?? ''
        this.isMessageError.proof_image = error.response.data.errors.proof_image[0] ?? ''
      } finally {
        this.isLoadingPayment = false
      }
    },

    // Block get payment student history payment
    async getHistoryUserPayment(id: number) {
      this.isLoadingPayment = true

      try {
        const res = await payment_provider.getPaymentByUserId(id)

        //
      } catch (error: any) {
        console.error(error)
      } finally {
        this.isLoadingPayment = false
      }
    },
    // ------
    async getPaymentByID(id: number) {
      this.isLoading = true

      try {
        const res = await payment_provider.getPaymentByID(id)
        if (res.status == 200 || res.status == 201) {
          this.data_state = res.data['data']
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    async getUserPayments({
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
      this.isLoadingPayment = true
      try {
        const res = await PaymentProvider.getUserPayments({ user_id, search, per_page, page })
        // console.log(res.data)
        if (res.status == 200 || res.status == 201) {
          this.data = res.data
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoadingPayment = false
      }
    },
  },
})
