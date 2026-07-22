/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UsersResponseApi, User } from '@/models/UserModel'
import user_provider from '@/providers/user_provider'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users_list: null as UsersResponseApi | null,
    user_info: null as User | null,
    search: '',
    per_page: 10,
    page: 1,
    isLoading: false,
    isLoadingAny: {
      isLoading: false,
      id: 0,
    },
    isMessage: '',
    isMessageAny: {
      type: 'error' as 'error' | 'success' | 'warning',
      message: '',
    },
    isOponeResetPassword: false,
    id: '',
    status: '',
    isOpen: false,
    isOpenUserCreateForm: false,
    isErrors: {
      phone_number: '',
      gender: '',
      first_name: '',
      last_name: '',
      user_name: '',
      email: '',
      role: '',
      status: '',
      bio: '',
      profile_photo_path: '',
      info: {
        id: 0,
        id_card: '',
        phone_parent: '',
        date_of_birth: '',
        major: '',
        level: '',
        year: '',
        address: '',
      },
      password: '',
      password_confirmation: '',
    },
    //
    uploadProgress: 0,
    isUploading: false,
  }),

  actions: {
    async getUsers(search: string, per_page: number = 10, page: number = 1) {
      this.isLoading = true
      try {
        const res = await user_provider.getUsers(search, per_page, page)

        if (res.status == 200) {
          this.users_list = res.data
        }
      } catch (error) {
        console.log(error)
      } finally {
        //
        this.isLoading = false
      }
    },

    // update info users
    async updateInfoUsers(id: string, data: any) {
      this.isLoading = true
      try {
        const res = await user_provider.updateInfoUsers(id, data)

        if (res.status == 200 || res.status == 201) {
          this.user_info = {
            ...this.user_info,
            ...res.data.data,
          }
          this.isMessageAny = {
            type: 'success',
            message: res.data.message,
          }
          setTimeout(() => {
            this.isMessageAny = {
              type: 'success',
              message: '',
            }
          }, 3000)
        }
      } catch (error: any) {
        this.isMessageAny = {
          type: 'error',
          message: error.response.data.message,
        }
        setTimeout(() => {
          this.isMessageAny = {
            type: 'error',
            message: '',
          }
        }, 3000)
      } finally {
        this.isLoading = false
      }
    },
    async updateStatus(data: any) {
      this.isLoadingAny.isLoading = true
      this.isLoadingAny.id = Number(data.id)
      try {
        const res = await user_provider.getUpdateStatus(data)

        if (res.status == 200) {
          // return this.getUsers(this.search, this.per_page, this.page)
          // check and updata data
          if (this.users_list?.data.data) {
            this.users_list.data.data = this.users_list.data.data.filter(
              (user) => user.id !== Number(data.id),
            )
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoadingAny.isLoading = false
      }
    },

    async addUsers(data: any) {
      this.isLoading = true
      this.isErrors.gender = ''
      this.isErrors.phone_number = ''
      try {
        const res = await user_provider.addUser(data)

        if (res.status == 200 || res.status == 201) {
          this.users_list?.data.data.unshift(res.data.data)
          this.isOpenUserCreateForm = false
        }
      } catch (error: any) {
        // check validations.
        this.isErrors.phone_number = error.response?.data.errors.phone_number[0]
        this.isErrors.first_name = error.response?.data.errors.first_name[0]
        this.isErrors.last_name = error.response?.data.errors.last_name[0]
        this.isErrors.user_name = error.response?.data.errors.user_name[0]
        this.isErrors.info.address = error.response?.data.errors.info.address[0]
        this.isErrors.password = error.response?.data.errors.password[0]
        this.isErrors.password_confirmation = error.response?.data.errors.password_confirmation[0]
      } finally {
        this.isLoading = false
      }
    },

    // Block delete user
    async deleteUser(id: number) {
      this.isLoadingAny.isLoading = true
      this.isLoadingAny.id = id
      try {
        const res = await user_provider.deleteUser(id)
        if (res.status == 200) {
          // this.getUsers(this.search, this.per_page, this.page)
          // check data and remove or delete
          if (this.users_list?.data.data) {
            this.users_list.data.data = this.users_list.data.data.filter((user) => user.id !== id)
          }
          this.isLoadingAny.id = 0
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoadingAny.isLoading = false
      }
    },
    // ---------- Students ---------------------
    async getStudentProfiles(id: number) {
      this.isLoading = true
      try {
        const res = await user_provider.getStudentProfile(id)
        if (res.status == 200) {
          return (this.user_info = res.data.data)
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    async changePasswordStudent(id: number, password: string) {
      this.isLoading = true
      try {
        const res = await user_provider.changePasswordStudent(id, password)
        if (res.status == 200) {
          this.isMessageAny = {
            type: 'success',
            message: res.data.message,
          }
          this.isOponeResetPassword = false
          setTimeout(() => {
            this.isMessageAny = {
              type: 'success',
              message: '',
            }
          }, 3000)
        }
      } catch (error: any) {
        this.isMessageAny = {
          type: 'error',
          message: error.response.data.message,
        }
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    async updateProfileImage(id: string, data: any) {
      //
      this.isUploading = true
      try {
        const res = await user_provider.updateProfileImage(id, data, (progress) => {
          this.uploadProgress = progress
          if (progress === 100) {
            setTimeout(() => {
              this.uploadProgress = 0
              this.isUploading = false
            }, 2000)
          }
        })

        if (res.status === 200 || res.status === 201) {
          this.user_info = res.data.data
          this.isMessageAny = {
            type: 'success',
            message: res.data.message,
          }
          setTimeout(() => {
            this.isMessageAny = {
              type: 'success',
              message: '',
            }
          }, 3000)
        }
      } catch (error: any) {
        //
        this.isUploading = false
        this.isMessageAny = {
          type: 'error',
          message: error.response.data.message,
        }
        setTimeout(() => {
          this.isMessageAny = {
            type: 'error',
            message: '',
          }
        }, 3000)
      }
    },
  },
})
