/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StaffProfileResponse } from '@/models/SatffModel'
import staff_provider from '@/providers/staff_provider'
import { defineStore } from 'pinia'

export const useStaffStoreStudent = defineStore('staffStore', {
  state: () => ({
    data: null as StaffProfileResponse | null,
    search: '',
    per_page: 10,
    page: 1,
    isLoading: false,
  }),

  actions: {
    async getStaffStoreStaffList(per_page: number = 10, page: number = 1) {
      this.isLoading = true
      try {
        const response = await staff_provider.getStaffList(page, per_page)
        this.data = response.data
      } catch (error: any) {
        console.error('Error fetching staff list:', error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
