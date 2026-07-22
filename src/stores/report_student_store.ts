/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LeaveResponse } from '@/models/LeaveModel'
import type { UsersResponseApi } from '@/models/UserModel'
import report_student_provider from '@/providers/report_student_provider'
import { defineStore } from 'pinia'

export const useReportStudent = defineStore('report', {
  state: () => ({
    data: null as UsersResponseApi | null,
    data_leave: null as LeaveResponse | null,
    data_payment: null as any | null,
    search: '',
    start_date: '',
    end_date: '',
    per_page: 10,
    page: 1,
    status: 'active',
    status_options: 'all',
    isLoading: false,
  }),
  actions: {
    async getUsers(
      search: string,
      start_date: string,
      end_date: string,
      status: string,
      per_page: number,
      page: number,
    ) {
      this.isLoading = true
      try {
        const res = await report_student_provider.getStudents(
          search,
          start_date,
          end_date,
          status,
          per_page,
          page,
        )
        if (res.status == 200) {
          this.data = res.data
          // console.log(res.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        // Logic
        this.isLoading = false
      }
    },
  },
})
