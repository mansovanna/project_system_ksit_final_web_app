/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api'

class AnnoucementProvider {
  getAnnouncementAll(search: string, per_page: number, page: number) {
    return api.get('/admin/announcements', {
      params: {
        search: search,
        per_page: per_page,
        page: page,
      },
    })
  }

  postAnnouns(data: any) {
    return api.post('/admin/announcements', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  getAnnouncementDetail(id: string) {
    return api.get(`/admin/announcements/${id}`)
  }

  // Block add file or create file
  addFiles(data: FormData) {
    return api.post(`/admin/announcements/files`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // Block delete file item
  deleteFile(id: string) {
    return api.delete(`/admin/announcements/files/${id}`)
  }

  updateAnnouncementFile(id: string, data: FormData) {
    data.append('_method', 'PUT')

    return api.post(`/admin/announcements/update-file/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
  updateAnnount(id: string, data: FormData) {
    return api.put(`/admin/announcements/${id}`, data)
  }

  deleteAnnoun(id: string) {
    return api.delete(`/admin/announcements/${id}`)
  }

  // ---------
  getStudentAnnouncements(search: string, per_page: number, page: number) {
    return api.get('/user/announcements', {
      params: {
        search: search,
        per_page: per_page,
        page: page,
      },
    })
  }

  getStudentAnnouncementDetail(id: string) {
    return api.get(`/user/announcements/${id}`)
  }
}

export default new AnnoucementProvider()
