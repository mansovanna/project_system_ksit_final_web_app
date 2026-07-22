/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LeaveResponse, LeaveResponseById } from '@/models/LeaveModel'
import leave_provider from '@/providers/leave_provider'
import report_student_provider from '@/providers/report_student_provider'
import { defineStore } from 'pinia'

export const useLeaveStore = defineStore('leave-store', {
  state: () => ({
    data: null as LeaveResponse | null,
    data_by_id: null as LeaveResponseById | null,
    search: '',
    start_date: '',
    end_date: '',
    per_page: 10,
    page: 1,
    status: 'all',
    isLoading: false,
    isLoadinAny: {
      id: 0,
      isLoading: false,
      isMessage: false,
    },
  }),
  actions: {
    async getLeaves(search: string = '', per_page: number = 10, page: number = 1) {
      this.isLoading = true
      try {
        const res = await leave_provider.getLeaves(search, per_page, page)
        if (res.status == 200 || res.status == 201) {
          console.log(res.data.data.data)
          this.data = res.data
        }
      } catch (error: any) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    async updateStatus(id: number, status: string) {
      this.isLoadinAny.isLoading = true

      try {
        const res = await leave_provider.checkUpdateStatus(id, status)

        if (res.status == 200 || res.status == 201) {
          this.isLoadinAny.isMessage = true
        }
      } catch (error: any) {
        console.error(error)
      } finally {
        this.isLoadinAny.isLoading = false
      }
    },

    async getLeaveByIdStudent(
      id: number,
      search: string = '',
      per_page: number = 10,
      page: number = 1,
    ) {
      this.isLoading = true
      try {
        const res = await leave_provider.getLeaveByIdStudent(id, search, per_page, page)
        if (res.status == 200 || res.status == 201) {
          this.data = res.data
        }
      } catch (error: any) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    async getLeaveById(id: number) {
      this.isLoading = true
      try {
        const res = await leave_provider.getLeaveById(id)
        if (res.status == 200 || res.status == 201) {
          this.data_by_id = res.data
        }
      } catch (error: any) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    async getLeaveReports(
      search: string,
      start_date: string,
      end_date: string,
      status: string,
      per_page: number,
      page: number,
    ) {
      this.isLoading = true
      try {
        const res = await report_student_provider.getLeaves(
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
