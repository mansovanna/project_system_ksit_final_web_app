import RoomProvider from '@/providers/room_provider'
import type { ApiResponse } from '@/models/ApiResponseModel'
import type { Pagination } from '@/models/PaginationModel'
import type { Room } from '@/models/RoomModel'
import { defineStore } from 'pinia'
import type { RoomActiveResponse } from '@/models/RoomActiveModel'
import type { UnAssingRoomResponce } from '@/models/UnActiveRoom'

export const useRoomStore = defineStore('room', {
  state: () => ({
    room_list: null as ApiResponse<Pagination<Room>> | null,
    room_anActive_list: null as UnAssingRoomResponce | null,
    room_anActive_list_old: null as UnAssingRoomResponce | null,
    isLoading: false,
    search: '',
    per_page: 10,
    page: 1,

    // ------------------
    roomAssignActive: null as RoomActiveResponse | null,
    isMessage: '',
    isOpen: false,
    id: 0,
    isLoadings: false,
    isLoadingOld: false,
    isLoadingAny: {
      isID: 0,
      isLoading: false,
    },
    isOpenFromCreate: false,
    isOpenFromUpdate: false,
  }),

  actions: {
    async getRooms(search: string, per_page: number = 10, page: number = 1) {
      // TODO: implement getRooms
      this.isLoading = true

      try {
        const res = await RoomProvider.getAllRoom(search, per_page, page)
        if (res.status == 200) {
          this.room_list = res.data
          // console.log(res.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    async roomActive(roomID: number) {
      try {
        const res = await RoomProvider.roomAssignActive(roomID)

        if (res.status == 200) {
          this.roomAssignActive = res.data
          // console.log(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    },

    async roomUnActive(roomId: number, search: string, per_page: number = 10, page: number = 1) {
      this.isLoading = true
      try {
        const res = await RoomProvider.unRoomAssignActive(search, per_page, page, roomId)

        if (res.status == 200) {
          this.room_anActive_list = res.data
          // console.log(res.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    async roomUnassignActiveOld(
      roomId: number,
      search: string,
      per_page: number = 10,
      page: number = 1,
    ) {
      this.isLoadingOld = true
      try {
        const res = await RoomProvider.unRoomAssignActiveOld(search, per_page, page, roomId)

        if (res.status == 200) {
          this.room_anActive_list_old = res.data
          // console.log(res.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoadingOld = false
      }
    },
    async roomAssigned(user_id: number, room_id: number) {
      //-----------------------------------------------------------
      this.isLoadingAny.isID = user_id
      this.isLoadingAny.isLoading = true
      try {
        const res = await RoomProvider.roomAssignment(user_id, room_id)

        if (res.status == 200) {
          // console.log(res.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoadingAny.isID = user_id
        this.isLoadingAny.isLoading = false
        this.roomActive(room_id)
        this.roomUnassignActiveOld(room_id, this.search, this.per_page, this.page)
        this.roomUnActive(room_id, this.search, this.per_page, this.page)
      }
    },
    async roomUnAssign(id: number) {
      this.isLoadings = true
      try {
        const res = await RoomProvider.roomUnAssignment(id)

        if (res.status == 200) {
          // console.log(res.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoadings = false
        this.isOpen = false
        this.isMessage = ''
      }
    },
    async removeAssign(id: number) {
      this.isLoadings = true

      try {
        const res = await RoomProvider.removeAssignment(id)

        if (res.status == 200) {
          // console.log('data is:')
        }
      } catch (error) {
        console.log(error)
      }
    },

    // Create room
    async createRoom(room_number: string, building_id: number, floor: number, max_member: number) {
      this.isLoading = true
      try {
        const res = await RoomProvider.createRoom(room_number, building_id, floor, max_member)

        if (res.status == 200 || res.status == 201) {
          // console.log(res.data)
          this.room_list?.data.data.push(res.data.data)
          this.isOpenFromCreate = false
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    // End Create room

    // Update room
    async updateRoom(
      id: number,
      data: { room_number: number; building_id: number; floor: number; max_member: number },
    ) {
      this.isLoading = true
      try {
        const res = await RoomProvider.updateRoom(id, data)

        if (res.status == 200 || res.status == 201) {
          // console.log(res.data)
          if (this.room_list?.data.data) {
            const index = this.room_list.data.data.findIndex((item) => item.id === id)
            if (index !== -1) {
              this.room_list.data.data[index] = res.data.data
            }
          }
          this.isOpenFromUpdate = false
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    // End Update room

    // Delete room
    async deleteRoom(id: number) {
      this.isLoadingAny.isLoading = true
      this.isLoadingAny.isID = id
      try {
        const res = await RoomProvider.deleteRoom(id)

        if (res.status == 200 || res.status == 201) {
          // check and delete or remover data on room_list
          if (this.room_list?.data.data) {
            this.room_list.data.data = this.room_list.data.data.filter((item) => item.id !== id)
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoadingAny.isLoading = false
      }
    },
    // End Delete room
  },
})
