/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LeaveResponse } from '@/models/LeaveModel'
import leave_student_providers from '@/providers/leave_student_providers'
import { defineStore } from 'pinia'

export const useLeaveStudentStore = defineStore('leaveStore', {
  state: () => ({
    data: null as LeaveResponse | null,
    activeTab: 'all',
    per_page: 10,
    status: '',
    page: 1,
    isLoading: false,
    isLoadings: false,
    errorMessage: {
      reason: '',
      start_date: '',
      end_date: '',
    },
    formData: {
      start_date: '',
      end_date: '',
      reason: '',
    },

    isMessageLeave: {
      message: '',
      status: '',
    },
  }),

  actions: {
    async requestLeave(data: FormData) {
      this.isLoadings = true
      try {
        const res = await leave_student_providers.requestLeave(data)
        console.log('res.status:', res.status) // ✅ status លេចអ្វី?
        console.log('res.data:', res.data) // ✅ data structure?

        if (res.status === 200 || res.status === 201) {
          this.formData = {
            start_date: '',
            end_date: '',
            reason: '',
          }

          this.isMessageLeave = {
            message: res.data.message,
            status: 'success',
          }
          if (this.data?.data?.data) {
            this.data.data.data.unshift(res.data.data)
          } else {
            // console.warn('this.data is null:', this.data) // ⚠️ null check
          }
        } else {
          // console.warn('Unexpected status:', res.status) // ⚠️ if block មិនចូល?
        }
      } catch (error: any) {
        console.error('Error:', error)
      } finally {
        // console.log('finally: isLoadings → false')
        this.isLoadings = false
      }
    },

    async getLeaveAll(stauts: string = 'all', per_page: number = 10, page: number = 1) {
      this.isLoading = true

      try {
        const res = await leave_student_providers.getLeave(stauts, per_page, page)
        if (res.status === 200) {
          this.data = res.data
        }
      } catch (error: any) {
        console.error('Is Error:', error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
