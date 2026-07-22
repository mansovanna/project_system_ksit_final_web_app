/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StaffModel, StaffResponse } from '@/models/SatffModel'
import api from '@/providers/api'
import staff_provider from '@/providers/staff_provider'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'

export const useStaffStore = defineStore('staff', {
  state: () => ({
    isShowCreate: false,
    staff_list: null as StaffResponse | null,
    staff_info: null as StaffModel | null,
    isLoading: false,
    isLoadingAny: {
      isLoading: false,
      id: 0,
    },
    search: '',
    per_page: 10,
    page: 1,
    formData: {
      username: '',
      email: '',
      bio: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      is_active: false,
      profile_image: null as File | null,
    },
    isMessageError: {
      username: '',
      email: '',
      bio: '',
      phone_number: '',
      password: '',
      confirm_password: '',
    },
    isLoadingCreate: false,
    isShowResetPassword: false,
    isLoadingUpdate: false,
  }),
  actions: {
    handleCrate() {
      this.isShowCreate = !this.isShowCreate
    },

    // ------------
    async get_staff_all(search: string, per_page: number = 10, page: number = 1) {
      this.isLoading = true

      try {
        const res = await staff_provider.getAllStaff(search, per_page, page)
        if (res.status == 200) {
          // console.log(res.data)
          this.staff_list = res.data
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    async get_staff_by_id(id: number) {
      this.isLoading = true

      try {
        const res = await staff_provider.showStaff(id)
        if (res.status == 200) {
          this.staff_info = res.data.data
          return this.staff_info
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    async store_staff(data: any) {
      this.isLoadingCreate = true
      try {
        const res = await staff_provider.storeStaff(data)
        if (res.status == 200) {
          this.isShowCreate = false
          this.get_staff_all(this.search, this.per_page, this.page)
        }
      } catch (error: any) {
        // console.log(error)
        if (error instanceof AxiosError) {
          const response = error.response?.data
          if (response && response.errors) {
            this.isMessageError = {
              ...this.isMessageError,
              ...response.errors,
            }

            // this.isMessageError.phone_number = response.errors
          }
        }
      } finally {
        this.isLoadingCreate = false
      }
    },
    // ---------------------------------------------------------------
    async reset_password(id: number, password: string) {
      this.isLoadingCreate = true
      try {
        const res = await staff_provider.resetPassword(id, password)
        if (res.status == 200) {
          this.isShowResetPassword = false
          this.get_staff_by_id(id)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoadingCreate = false
        this.isShowResetPassword = false
      }
    },
    // ----------------------------------------------------------------
    async update_staff(id: number, data: any) {
      this.isLoadingUpdate = true
      try {
        const res = await staff_provider.updateProfile(id, data)
        if (res.status == 200) {
          this.get_staff_all(this.search, this.per_page, this.page)
          // this.handleCrate()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoadingUpdate = false
      }
    },

    async update_profile_image(id: number, image: File, onProgress?: (percent: number) => void) {
      try {
        const formData = new FormData()
        formData.append('profile_photo_path', image)
        formData.append('_method', 'PUT')
        await api.post(`/admin/staff/update-profile-image/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            if (!e.total) return
            const percent = Math.round((e.loaded * 100) / e.total)
            if (onProgress) onProgress(percent)
          },
        })

        // Refresh staff info after upload
        this.get_staff_by_id(id)
      } catch (error) {
        console.log(error)
      }
    },
    // ---------------------------------------------------------------
    async delete_staff(id: number) {
      this.isLoadingAny.isLoading = true
      this.isLoadingAny.id = id
      try {
        const res = await staff_provider.deleteStaff(id)
        if (res.status == 200) {
          // check update
          if (this.staff_list?.data.data) {
            this.staff_list.data.data = this.staff_list.data.data.filter((item) => item.id !== id)
            // this.get_staff_all(this.search, this.per_page, this.page)
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoadingAny.isLoading = false
      }
    },
  },
})
