import api from './api'

class RoomProvider {
  getAllRoom(search: string, per_page: number, page: number) {
    return api.get('/admin/room', {
      params: {
        search: search,
        per_page: per_page,
        page: page,
      },
    })
  }

  roomAssignActive(roomId: number) {
    return api.get(`/admin/room/assign-active/${roomId}`)
  }
  unRoomAssignActive(search: string, per_page: number = 10, page: number = 1, roomId: number) {
    return api.get(`/admin/room/un-assign-active/${roomId}`, {
      params: {
        search: search,
        per_page: per_page,
        page: page,
      },
    })
  }
  unRoomAssignActiveOld(search: string, per_page: number = 10, page: number = 1, roomId: number) {
    return api.get(`/admin/room/un-assign-active-old/${roomId}`, {
      params: {
        search: search,
        per_page: per_page,
        page: page,
      },
    })
  }
  roomAssignment(user_id: number, room_id: number) {
    return api.post('/admin/room/assign-user', {
      user_id: user_id,
      room_id: room_id,
    })
  }
  roomUnAssignment(id: number) {
    return api.put(`/admin/room/un-assign-user/${id}`)
  }

  removeAssignment(id: number) {
    return api.delete(`/admin/room/remove-assign/${id}`)
  }

  // Create room
  createRoom(room_number: string, building_id: number, floor: number, max_member: number) {
    return api.post('/admin/room', {
      room_number: room_number,
      building_id: building_id,
      floor: floor,
      max_member: max_member,
    })
  }

  // Update room
  updateRoom(
    id: number,
    data: { room_number: number; building_id: number; floor: number; max_member: number },
  ) {
    return api.put(`/admin/room/${id}`, data)
  }
  // End Update room

  // Delete room
  deleteRoom(id: number) {
    return api.delete(`/admin/room/${id}`)
  }
  // End Delete room
}

export default new RoomProvider()
