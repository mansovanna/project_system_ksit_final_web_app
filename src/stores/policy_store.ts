/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PolicyListResponse, PolicyResponse } from '@/models/PolicyModel'
import policy_provider from '@/providers/policy_provider'
import { defineStore } from 'pinia'

export const usePolicyStore = defineStore('policy_store', {
  state: () => ({
    data: null as PolicyListResponse | null,
    data_id: null as PolicyResponse | null,
    isShowModal: false,
    isLoading: false,
    isLoadingAny: {
      id: 0,
      loading: false,
    },
    isShowUpdate: false,
    isShowUpdateFile: false,
    isLoadingUpdate: {
      title: '',
      isLoading: false,
      type: '',
    },
    isMessageError: {
      title: '',
      description: '',
    },
    search: '',
    per_page: 10,
    page: 1,
  }),
  actions: {
    handleShowModal() {
      this.isShowModal = !this.isShowModal
    },
    handleShowUpdate() {
      this.isShowUpdate = !this.isShowUpdate
      this.isMessageError.title = ''
      this.isMessageError.description = ''
    },

    // get data from api
    async getPolicy(params: { search?: string; per_page?: number; page?: number }) {
      this.isLoading = true
      try {
        const response = await policy_provider.getPolicy(params)
        // console.log(response)
        if (response.status === 200 || response.status === 201) {
          // console.log(response)
          this.data = response.data
        }
        // return response
      } catch (error) {
        console.error('Error fetching policies:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Block create policy

    async createPolicy(data: any) {
      this.isLoading = true
      try {
        const response = await policy_provider.createPolicy(data)

        if (response.status === 200 || response.status === 201) {
          if (this.data?.data.data) {
            this.data.data.data.unshift(response.data)
            this.isShowModal = false
          }
        }
        // return response
      } catch (error) {
        console.error('Error creating policy:', error)
      } finally {
        this.isLoading = false
      }
    },

    // get policy by id
    async getPolicyById(id: string) {
      this.isLoading = true
      try {
        const response = await policy_provider.getPolicyById(id)
        // console.log(response)
        if (response.status === 200 || response.status === 201) {
          // console.log(response)
          this.data_id = response.data
        }
        // return response
      } catch (error) {
        console.error('Error fetching policy:', error)
      } finally {
        this.isLoading = false
      }
    },

    // delete file
    async deletePolicyById(id: number) {
      this.isLoadingAny.id = id
      this.isLoadingAny.loading = true

      try {
        const response = await policy_provider.deletePolicy(id)

        if (response.status === 200 || response.status === 201) {
          if (this.data?.data.data) {
            this.data.data.data = this.data.data.data.filter((item) => item.id !== id)
          }
        }
      } catch (error) {
        console.error('Error deleting policy:', error)
      } finally {
        this.isLoadingAny.id = 0
        this.isLoadingAny.loading = false
      }
    },

    async policyUpdateFile(id: number, data: any) {
      this.isLoadingUpdate.isLoading = true
      this.isLoadingUpdate.title = ''
      this.isLoadingUpdate.type = ''

      try {
        const res = await policy_provider.updateFile(id, data)

        if (res.status === 200 || res.status === 201) {
          if (this.data_id) {
            // this.data_id?.data.file_path = res.data[0].data.file_path
            this.isLoadingUpdate.title = 'Update succesfully'
            this.isLoadingUpdate.type = 'success'
            // console.log(res.data)
          }
        }
      } catch (error: any) {
        console.log('Data is', error)
        this.isLoadingUpdate.title = error?.response?.data[0]
        this.isLoadingUpdate.type = 'error'
      } finally {
        this.isLoadingUpdate.isLoading = false
      }
    },

    async updatePolicy(id: number, title: string, description: string) {
      this.isLoadingAny.id = id
      this.isLoadingAny.loading = true
      try {
        const res = await policy_provider.updatePolicy(id, {
          title: title,
          description: description,
        })

        if (res.status == 200 || res.status == 201) {
          // filter old data
          if (this.data?.data.data) {
            this.data.data.data = this.data.data.data.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  title: title,
                  description: description,
                }
              }
              return item
            })
          }
          this.handleShowUpdate()
          // alert('Update success')
        }
      } catch (error: any) {
        console.error(error)
      } finally {
        this.isLoadingAny.loading = false
      }
    },

    // get policy only
    async getPolicyOnly({
      search,
      per_page,
      page,
    }: {
      search: string
      per_page: number
      page: number
    }) {
      this.isLoading = true
      try {
        const response = await policy_provider.getPolicyOnly({ search, per_page, page })
        // console.log(response)
        if (response.status === 200 || response.status === 201) {
          // console.log(response)
          this.data = response.data
        }
        // return response
      } catch (error) {
        console.error('Error fetching policies:', error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
