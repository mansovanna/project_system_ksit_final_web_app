/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IndexModelResponse } from '@/models/IndexModel'
import index_provider from '@/providers/index_provider'
import { defineStore } from 'pinia'

export const useIndexStore = defineStore('index', {
  state: () => ({
    data: null as IndexModelResponse | null,
    isLoading: false,
  }),
  actions: {
    async getIndex() {
      this.isLoading = true
      try {
        const res = await index_provider.getIndex()
        if (res.status == 200 || res.status == 201) {
          this.data = res.data
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
