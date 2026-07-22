/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api'

class UserProvider {
  getUsers(search: string, per_page: number, page: number) {
    return api.get('/admin/users', {
      params: {
        search: search,
        per_page: per_page,
        page: page,
      },
    })
  }

  addUser(data: any) {
    return api.post('/admin/users', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // update info for userr
  updateInfoUsers(id: string, data: any) {
    return api.put(`/admin/users/update-info/${id}`, data)
  }

  getUserByID(id: number) {
    return api.get(`/admin/users/${id}`)
  }

  getUpdateStatus(data: any) {
    return api.post('/admin/users/update-status', data)
  }

  // -------------------- Block students ------------------------------------------
  getStudentProfile(id: number) {
    return api.get(`admin/users/profile/${id}`)
  }

  changePasswordStudent(id: number, newPassword: string) {
    return api.post(`admin/users/change-password/${id}`, { password: newPassword })
  }

  // Block upload profile image that have progress
  updateProfileImage(id: string, data: any, onProgress?: (progress: number) => void) {
    return api.post(`/admin/staff/update-profile-image/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },

      onUploadProgress: (event) => {
        if (event.total) {
          const progress = Math.round((event.loaded * 100) / event.total)
          onProgress?.(progress)
        }
      },
    })
  }

  deleteUser(id: number) {
    return api.delete(`/admin/users/${id}`)
  }
}

export default new UserProvider()
