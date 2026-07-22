/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api'

class StaffProvider {
  getAllStaff(search: string, per_page: number = 10, page: number = 1) {
    return api.get('/admin/staff', {
      params: {
        search: search,
        per_page: per_page,
        page: page,
      },
    })
  }
  storeStaff(data: any) {
    return api.post('/admin/staff', data)
  }
  showStaff(id: number) {
    return api.get(`/admin/staff/${id}`)
  }

  deleteStaff(id: number) {
    return api.delete(`/admin/staff/${id}`)
  }
  // ----------------------------------------
  resetPassword(id: number, password: string) {
    return api.put(`/admin/staff/reset-password/${id}`, { password: password })
  }
  // updateProfileImage(id: number, image: File) {
  //   const formData = new FormData()
  //   formData.append('profile_image', image)

  //   return api.put(`/admin/staff/update-profile-image/${id}`, formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   })
  // }

  updateProfile(id: number, data: any) {
    return api.put(`/admin/staff/update-profile/${id}`, data)
  }

  // student side
  getStaffList(page: number = 1, per_page: number = 10) {
    return api.get('/staffs', {
      params: {
        page: page,
        per_page: per_page,
      },
    })
  }
}

export default new StaffProvider()
