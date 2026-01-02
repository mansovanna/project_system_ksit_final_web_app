import { defineStore } from 'pinia'

export const useStaffStore = defineStore('staff', {
  state: () => ({
    isShowCreate: false,
  }),
  actions: {
    handleCrate() {
      this.isShowCreate = !this.isShowCreate
    },
  },
})
