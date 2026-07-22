/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AnnoucentResponseApi, AnnouncementResponeModel } from '@/models/AnnouncementModel'
import announcement_provider from '@/providers/announcement_provider'
import { defineStore } from 'pinia'

export const useAnnouncementStore = defineStore('annount', {
  state: () => ({
    data: null as AnnoucentResponseApi | null,
    data_list: null as AnnouncementResponeModel | null,
    search: '',
    per_page: 10,
    page: 1,
    isLoading: false,
    isLoadings: false,
    isOpenCreate: false,
    isOpenUpdate: false,
    isErrorMessage: {
      title: '',
      description: '',
      status: '',
      file: '',
      messageError: '',
    },
    formData: {
      title: '',
      description: '',
      status: 'private',
      files: [] as File[],
    },
    isShowUpdateFile: false,
    isLoadingUpdate: {
      title: '',
      type: '',
      isLoading: false,
    },
    item: {
      id: '',
      isLoading: false,
      status: '',
    },
    isPreviewFile: {
      file: '',
      status: false,
    },
  }),
  actions: {
    // function check file type
    checkFileType(file: string) {
      const fileType = file.split('.').pop()
      return fileType
    },

    preViewFile(file: string) {
      this.isPreviewFile.file = file
      this.isPreviewFile.status = true
    },
    clearFilePreview() {
      this.isPreviewFile.file = ''
      this.isPreviewFile.status = false
    },
    async getAlls(search: string, per_page: number = 10, page: number = 1) {
      this.isLoading = true

      try {
        const res = await announcement_provider.getAnnouncementAll(search, per_page, page)

        if (res.status == 200) {
          //
          this.data = res.data
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    async postAnnounce(data: any) {
      this.isLoadings = true

      try {
        const res = await announcement_provider.postAnnouns(data)

        if (res.status === 200 || res.status === 201) {
          this.isOpenCreate = false

          this.formData.title = ''
          this.formData.description = ''
          this.formData.status = 'private'
          this.formData.files = []

          this.isErrorMessage.title = ''
          this.isErrorMessage.description = ''
          this.isErrorMessage.status = ''

          if (this.data && this.data.data) {
            this.data.data.data.unshift(res.data.data)
          }
        }
      } catch (error: any) {
        this.isErrorMessage.messageError = error.response.data.message
      } finally {
        this.isLoadings = false
      }
    },

    async deleteItem(id: string) {
      this.item.isLoading = true
      this.item.id = id
      this.item.status = 'delete'
      try {
        const res = await announcement_provider.deleteAnnoun(id)
        if (res.status === 200 || res.status === 201) {
          if (this.data?.data?.data) {
            this.data.data.data = this.data.data.data.filter((item) => item.id !== Number(id))
          }
        }
      } catch (error: any) {
        console.log(error)
        this.isErrorMessage.title = error.response.data.message
      } finally {
        this.item.isLoading = false
        this.item.status = ''
      }
    },

    async updateItem(id: string, data: FormData) {
      this.isErrorMessage.messageError = ''
      this.item.isLoading = true
      this.item.id = id
      this.item.status = 'update'
      try {
        const res = await announcement_provider.updateAnnount(id, data)
        if (res.status === 200) {
          this.item.status = ''
          this.item.id = ''
          this.isOpenUpdate = false

          if (this.data?.data?.data) {
            this.data.data.data = this.data.data.data.map((item) => {
              if (item.id === Number(id)) {
                return res.data.data
              }

              return item
            })
          }
        }
      } catch (error: any) {
        this.isErrorMessage.messageError = error.response.data.message
      } finally {
        this.item.isLoading = false
        this.item.status = ''
      }
    },

    async announcementDetail(id: string) {
      this.isLoading = true
      try {
        const res = await announcement_provider.getAnnouncementDetail(id)

        if (res.status == 200 || res.status == 201) {
          this.data_list = res.data
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    // add file or create new file
    async addFiles(data: FormData) {
      this.isLoadingUpdate.isLoading = true
      this.isLoadingUpdate.title = 'add'
      this.isLoadingUpdate.type = 'add'
      try {
        const res = await announcement_provider.addFiles(data)
        if (res.status === 200 || res.status === 201) {
          this.isLoadingUpdate.isLoading = false
          this.isLoadingUpdate.title = ''
          this.isLoadingUpdate.type = ''
          this.isShowUpdateFile = false
          this.formData.files = []
          if (this.data_list?.data.files) {
            this.data_list.data = res.data.data
          }
        }
      } catch (error: any) {
        this.isErrorMessage.messageError = error.response.data.message
      } finally {
        this.isLoadingUpdate.isLoading = false
        this.isLoadingUpdate.title = ''
        this.isLoadingUpdate.type = ''
      }
    },

    // Block delete file item
    async deleteFile(id: string) {
      this.item.isLoading = true
      this.item.id = id
      this.item.status = 'delete'
      try {
        const res = await announcement_provider.deleteFile(id)
        if (res.status === 200 || res.status === 201) {
          this.item.status = ''
          this.item.id = ''
          this.isShowUpdateFile = false
          this.formData.files = []
          if (this.data_list?.data.files) {
            this.data_list.data.files = this.data_list.data.files.filter(
              (item: any) => item.id !== Number(id),
            )
          }
        }
      } catch (error: any) {
        this.isErrorMessage.messageError = error.response.data.message
      } finally {
        this.item.isLoading = false
        this.item.status = ''
      }
    },

    // Block Download file
    async downloadFile(id: string, url: string, fileName: string) {
      this.item.isLoading = true
      this.item.id = id
      this.item.status = 'download'
      console.log('Downloading from:', url)
      try {
        const response = await fetch(url, { credentials: 'include' })

        if (!response.ok) {
          throw new Error(`Download failed with status ${response.status}`)
        }

        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = fileName

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        window.URL.revokeObjectURL(downloadUrl)
      } catch (error) {
        console.error('Download failed:', error)
        // e.g. this.item.error = 'Download failed, please try again'
      } finally {
        this.item.isLoading = false
        this.item.id = ''
        this.item.status = ''
      }
    },
    // Add this action:
    async updateAnnouncementFile(id: string, data: FormData) {
      this.item.isLoading = true
      this.item.id = id
      this.item.status = 'update'
      this.isLoadingUpdate.title = ''
      this.isLoadingUpdate.type = ''

      try {
        const res = await announcement_provider.updateAnnouncementFile(id, data)

        if (res.status === 200 || res.status === 201) {
          this.isShowUpdateFile = false
          this.item.status = ''
          this.item.id = ''

          if (this.data_list?.data.files) {
            this.data_list.data.files = this.data_list.data.files.map((item: any) => {
              if (item.id === Number(id)) {
                return res.data.data
              }
              return item
            })
          }
        }
      } catch (error: any) {
        this.isErrorMessage.messageError =
          error?.response?.data?.message || 'ការធ្វើបច្ចុប្បន្នភាពបានបរាជ័យ'
      } finally {
        this.item.isLoading = false
      }
    },
    // ---------
    async studentAnnouncements(search: string, per_page: number = 10, page: number = 1) {
      this.isLoading = true
      try {
        const res = await announcement_provider.getStudentAnnouncements(search, per_page, page)

        if (res.status == 200) {
          // console.log(res.data)
          this.data = res.data
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    async studentAnnouncementDetail(id: string) {
      this.isLoading = true
      try {
        const res = await announcement_provider.getStudentAnnouncementDetail(id)

        if (res.status == 200) {
          this.data_list = res.data
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
