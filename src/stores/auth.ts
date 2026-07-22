/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AuthResponse, User } from '@/models/UserModel'
import AuthProvider from '@/providers/auth'
import { defineStore } from 'pinia'
import router from '@/router'
import api from '@/providers/api'
import type { AnnouncementResponeModel } from '@/models/AnnouncementModel'
import type { UserModelReponce } from '@/models/UserModel'
import axios from 'axios'
import { nextTick } from 'vue'
import type { RegisterForm } from '@/models/RegisterModel'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {} as unknown as AuthResponse | null,
    current_use: JSON.parse(localStorage.getItem('current_user') || 'null') as User | null,
    data_annon: null as AnnouncementResponeModel | null,
    data_staffs: null as UserModelReponce | null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    isLoadings: false,
    isMessageError: {
      login: '',
      password: '',
    },
    errors: <Record<keyof RegisterForm, string>>(<unknown>{
      login: '',
      user_name: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      role: '',
      status: '',
      bio: '',
      profile_photo_path: '',
      profile_photo_url: '',
      id_card: '',
      password: '',
      password_confirme: '',
      password_old: '',
      phone_parent: '',
      date_of_birth: '',
      gender: '',
      major: '',
      level: '',
      year: '',
      address: '',
    }),
    errorMessage: '',
    successMessage: '',
    passwordMessage: {
      loading: false,
      message: '',
      type: '',
    },
  }),
  actions: {
    async registerForm(data: FormData) {
      this.isLoading = true
      try {
        const res = await AuthProvider.register(data)
        if (res.status === 200 || res.status === 201) {
          // this.user = res.data
          // if (this.user?.access_token) {
          //   this.current_use = res.data.data
          //   localStorage.setItem('current_user', JSON.stringify(this.user.data))
          //   this.writeToken(this.user.access_token)

          //   await nextTick()

          //   if (res.data.type === 'admin' || res.data.type === 'staff') {
          //     await router.push('/admin')
          //   } else if (res.data.type === 'user') {
          //     await router.push('/student')
          //   }
          // }

          await nextTick()

          await router.push('/login')
        }
      } catch (error: any) {
        this.isMessageError.login = error.response.data.message
        await nextTick()
        this.errors.login = error.response.data.errors.id_card[0]
        this.errors.phone_number = error.response.data.errors.phone_number[0]
        this.errors.user_name = error.response.data.errors.user_name[0]
        this.errors.first_name = error.response.data.errors.first_name[0]
        this.errors.last_name = error.response.data.errors.last_name[0]
        this.errors.date_of_birth = error.response.data.errors.date_of_birth[0]
        this.errors.gender = error.response.data.errors.gender[0]
        this.errors.address = error.response.data.errors.address[0]
        this.errors.level = error.response.data.errors.level[0]
        this.errors.year = error.response.data.errors.year[0]
        this.errors.major = error.response.data.errors.major[0]
        this.errors.phone_parent = error.response.data.errors.phone_parent[0]
        this.errors.file = error.response.data.errors.file[0]
        this.errors.password = error.response.data.errors.password[0]
        this.errors.password_confirme = error.response.data.errors.password_confirme[0]
      } finally {
        this.isLoading = false
      }
    },
    //
    async loginForm(login: string, password: string) {
      this.isLoading = true
      try {
        const res = await AuthProvider.login(login, password)

        if (res.status === 200) {
          this.user = res.data
          if (this.user?.access_token) {
            this.current_use = res.data.data
            localStorage.setItem('current_user', JSON.stringify(this.user.data))
            this.writeToken(this.user.access_token)

            await nextTick()

            if (res.data.type === 'admin' || res.data.type === 'staff') {
              await router.push('/admin')
            } else if (res.data.type === 'user') {
              await router.push('/student')
            }
          }
        }
      } catch (error: any) {
        this.isMessageError.login = error.response.data.message
        this.isMessageError.password = error.response.data.message
      } finally {
        this.isLoading = false
      }
    },

    // store
    writeToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    //
    async initziliUser() {
      this.isLoadings = true
      try {
        const res = await AuthProvider.getMe()

        if (res.status === 200) {
          this.current_use = res.data
        }
      } catch (error) {
        this.user = null
        console.log(error)
        this.logout()
      } finally {
        this.isLoadings = false
      }
    },

    async logout() {
      this.isLoadings = true
      try {
        const res = await AuthProvider.logout()

        if (res.status == 200) {
          localStorage.removeItem('token')
          router.push({ name: 'login' })
          console.log('Logouts Successfully!')
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        // logic
        this.isLoadings = false
      }
    },

    // chanage Password
    async changePassword(data: any) {
      this.passwordMessage.loading = true
      this.passwordMessage.message = ''
      this.passwordMessage.type = ''
      try {
        const res = await AuthProvider.changePassword(data)
        if (res.status == 200) {
          this.passwordMessage.message = res.data.message
          this.passwordMessage.type = 'success'
          return res
        }
      } catch (error: any) {
        this.passwordMessage.message = error.response.data.message
        this.passwordMessage.type = 'error'
        this.errors.password_old = error.response.data.data.errors.password_old[0]
        this.errors.password = error.response.data.data.errors.password[0]
        this.errors.password_confirme = error.response.data.data.errors.password_confirme[0]
      } finally {
        this.passwordMessage.loading = false
      }
    },

    async changeInfo(data: any) {
      this.isLoadings = true
      this.errorMessage = ''
      this.successMessage = ''
      try {
        const res = await AuthProvider.changeInfo(data)
        if (res.status == 200) {
          //
          this.successMessage = res.data.message
          this.current_use = res.data.data
          localStorage.setItem('current_user', JSON.stringify(this.current_use))
        }
      } catch (error: any) {
        console.log(error)
        this.errorMessage = error.response.data.message
      } finally {
        this.isLoadings = false
      }
    },

    async update_profile_image(image: File, onProgress?: (percent: number) => void) {
      this.errorMessage = ''
      this.successMessage = ''
      try {
        const formData = new FormData()
        formData.append('profile_photo_path', image)
        const res = await api.post(`/admin/chanage-info-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            if (!e.total) return
            const percent = Math.round((e.loaded * 100) / e.total)
            if (onProgress) onProgress(percent)
          },
        })

        if (res.status == 200) {
          this.current_use = res.data.data
          this.successMessage = res.data.message
        }

        // Refresh staff info after upload
      } catch (error: any) {
        console.log(error)
        this.errorMessage = error.response.data.message
      }
    },

    async getOneAnnouncementOnly() {
      this.isLoading = true

      try {
        const res = await AuthProvider.getAnnouncementOnlyOne()

        if (res.status == 200) {
          this.data_annon = res.data
          console.log(res.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    async getStaffOnly() {
      this.isLoadings = false
      try {
        const res = await AuthProvider.getStaffListOnly()

        if (res.status == 200) {
          console.log(res.status)
          this.data_staffs = res.data
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoadings = false
      }
    },

    // --------------------
    async changePasswordOfUser(data: any) {
      this.isLoading = true
      this.errorMessage = ''
      this.successMessage = ''

      try {
        const res = await AuthProvider.changePasswordUser(data)

        if (res.status === 200) {
          this.successMessage = 'Password updated successfully'
          console.log('Good')
        }
      } catch (error: any) {
        // ✅ handle Laravel validation or custom errors
        if (error.response) {
          this.errorMessage = error.response.data.message || 'Something went wrong'
        } else {
          this.errorMessage = 'Network error'
        }

        console.log('Error:', error)
      } finally {
        this.isLoading = false
      }
    },

    async changeInfoUser(data: any) {
      this.isLoading = true
      try {
        const res = await AuthProvider.changeInfoUser(data)
        if (res.status == 200 || 201) {
          this.current_use = res.data.data
          localStorage.setItem('current_user', JSON.stringify(res.data.data))
          // alert
          // alert('This is App')
          this.successMessage = 'Update successfully!'
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
