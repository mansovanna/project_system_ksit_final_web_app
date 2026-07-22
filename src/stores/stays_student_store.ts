/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RoomAssignmentResponse } from '@/models/RoomAssignmentModel'
import stays_student_provider from '@/providers/stays_student_provider'
import { defineStore } from 'pinia'

export const useStaysStudentStore = defineStore('staysStudentStore', {
  state: () => ({
    data: null as RoomAssignmentResponse | null,
    search: '',
    per_page: 10,
    page: 1,
    isLoading: false,
  }),
  actions: {
    async getStaysStudentList(per_page: number = 10, page: number = 1) {
      this.isLoading = true
      try {
        const res = await stays_student_provider.getStaysStudentList(page, per_page)

        if (res.status === 200) {
          this.data = res.data
          // console.log(res.data)
        }
      } catch (error: any) {
        console.error('Error fetching stays student list:', error)
      } finally {
        this.isLoading = false
      }
    },

    async getStaysByIdStudent(
      id: number,
      search: string = '',
      per_page: number = 10,
      page: number = 1,
    ) {
      this.isLoading = true
      try {
        const res = await stays_student_provider.getStaysByIdStudent(id, search, page, per_page)

        if (res.status === 200 || res.status === 201) {
          this.data = res.data
          // console.log(res.data)
        }
      } catch (error: any) {
        console.error('Error fetching stays student list:', error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
