/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api'

class AuthProvider {
  register(data: any) {
    return api.post('/register', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  login(login: string, password: string) {
    return api.post('/login', {
      login: login,
      password: password,
    })
  }

  getMe() {
    return api.get('/me')
  }

  // ------------
  changePassword(data: any) {
    return api.post('/admin/profile-info-chanage-password', data)
  }

  changeInfo(data: any) {
    return api.post('/admin/profile-info-changes', data)
  }

  // -------- Block Users -------------------------
  changePasswordUser(data: any) {
    return api.post('/user/profile-info-change-password', data)
  }

  changeInfoUser(data: any) {
    return api.post('/user/profile-info-update', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
  // -----
  logout() {
    return api.delete('/logout')
  }

  getAnnouncementOnlyOne() {
    return api.get('/announcement-only')
  }

  getStaffListOnly() {
    return api.get('/staff-list-only')
  }
}

export default new AuthProvider()
