import type { BuildingResponceApi } from '@/models/BuildModel'
import building_provider from '@/providers/building_provider'
import BuildProvider from '@/providers/building_provider'
import { defineStore } from 'pinia'

export const useBuildStore = defineStore('build', {
  state: () => ({
    build_list: null as BuildingResponceApi | null,
    isLoading: false,
    isLoadingUpdate: false,
    isLoadingAny: {
      isloading: false,
      id: 0,
    },
    search: '',
    per_page: 10,
    page: 1,
    formData: {
      id: 0,
      name: '',
      gender: '',
      floor: '',
      room: '',
    },
    isMessagError: {
      name: '',
      gender: '',
      floor: '',
      room: '',
    },

    isSelectStateAdd: false,
    isOpenFromUpdate: false,
  }),
  actions: {
    async getBuildList(search: string, per_page: number = 10, page: number = 1) {
      this.isLoading = true
      try {
        const res = await BuildProvider.getBuiildAll(search, per_page, page)

        if (res.status == 200) {
          // console.log(res.data)
          this.build_list = res.data
        }
      } catch (error) {
        console.log('Th is:', error)
      } finally {
        this.isLoading = false
      }
    },

    async createBuilding(name: string, gender: string, floor: number, room: number) {
      this.isLoadingUpdate = true
      try {
        const res = await BuildProvider.addBuild(name, gender, floor, room)

        if (res.status == 200) {
          // console.log(res.data)
          this.build_list?.data.data.unshift({
            id: res.data.data[res.data.data.length - 1]?.id || 0,
            name: this.formData.name,
            gender: this.formData.gender,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            rooms_count: Number(this.formData.room),
          })
          this.isSelectStateAdd = false
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoadingUpdate = false
      }
    },

    async buildingUpdate(id: string, name: string, gender: string) {
      this.isLoadingUpdate = true
      try {
        // api response ---------------------------------------------
        const res = await building_provider.updateBuild(id, name, gender)

        if (res.status == 200 || res.status == 201) {
          // check update data
          if (this.build_list?.data.data) {
            this.build_list.data.data = this.build_list.data.data.map((item) =>
              item.id === res.data.data.id ? res.data.data : item,
            )
          }
          this.isOpenFromUpdate = false
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoadingUpdate = false
      }
    },

    // Block delete
    async deleteBuild(id: number) {
      this.isLoadingAny.isloading = true
      try {
        const res = await building_provider.deleteBuild(id)

        if (res.status == 200 || res.status == 201) {
          // check update data
          if (this.build_list?.data.data) {
            this.build_list.data.data = this.build_list.data.data.filter((item) => item.id !== id)
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoadingAny.isloading = false
      }
    },

    clearFormData() {
      this.formData.name = ''
      this.formData.gender = ''
      this.formData.floor = ''
      this.formData.room = ''

      this.isMessagError.name = ''
      this.isMessagError.gender = ''
      this.isMessagError.floor = ''
      this.isMessagError.room = ''
    },

    // Handdle function controller state!...
    toggleAdd() {
      this.isSelectStateAdd = !this.isSelectStateAdd
    },
    toggleUpdate() {
      this.isOpenFromUpdate = !this.isOpenFromUpdate
    },
    toggleUpdateClear() {
      this.isOpenFromUpdate = false
      this.clearFormData()
    },
  },
})
