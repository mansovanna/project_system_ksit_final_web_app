import api from './api'

class LeaveProviders {
  getLeaves(search: string, per_page: number, page: number) {
    return api.get('/admin/leave', {
      params: {
        search: search,
        per_page: per_page,
        page: page,
      },
    })
  }

  checkUpdateStatus(id: number, status: string) {
    return api.put(`/admin/leave/${id}`, {
      status: status,
    })
  }

  getLeaveByIdStudent(id: number, search: string = '', per_page: number, page: number) {
    return api.get(`/admin/leave/student/${id}`, {
      params: {
        page: page,
        per_page: per_page,
        search: search,
      },
    })
  }

  // ---------
  getLeaveById(id: number) {
    return api.get(`/admin/leave/${id}`)
  }
}

export default new LeaveProviders()
